local octopusBaseUrl = os.getenv("OCTOPUS_URL")
local octopusApiKey = os.getenv("OCTOPUS_API_KEY")
local octopusApiSecret = os.getenv("OCTOPUS_API_SECRET")
local allowedURLS = os.getenv("ALLOWED_URLS")
local storage = module:open_store()

local json = require "util.json";
local jid = require 'util.jid';
local http = require "net.http";
local timer = require 'util.timer';
local is_healthcheck_room = module:require "util".is_healthcheck_room;

local api_prefix = module:get_option("api_prefix");
local api_timeout = module:get_option("api_timeout", 20);
local api_headers = module:get_option("api_headers");
local api_retry_count = tonumber(module:get_option("api_retry_count", 3));
local api_retry_delay = tonumber(module:get_option("api_retry_delay", 1));

module:log("info", "Loading Octopus module")

-- Option for user to control HTTP response codes that will result in a retry.
-- Defaults to returning true on any 5XX code or 0
local api_should_retry_for_code = module:get_option("api_should_retry_for_code", function(code)
    return code >= 500;
end)

-- common HTTP headers added to all API calls
local http_headers = {
    ["User-Agent"] = "Prosody (" .. prosody.version .. "; " .. prosody.platform .. ")",
    ["Content-Type"] = "application/json"
};
if api_headers then -- extra headers from config
    for key, value in pairs(api_headers) do
        http_headers[key] = value;
    end
end

local URL_EVENT_ROOM_CREATED = '/v1/meeting/events/room/created';
local URL_EVENT_ROOM_DESTROYED = '/v1/meeting/events/room/destroyed';
local URL_EVENT_OCCUPANT_JOINED = '/v1/meeting/events/occupant/joined';
local URL_EVENT_OCCUPANT_LEFT = '/v1/meeting/events/occupant/left';

function get_url(meetingName)
    local underscorePosition = string.find(meetingName, "_")

    if underscorePosition then
        request_url = "https://" .. string.sub(meetingName, underscorePosition + 1)
        -- we will check if it is in string later
        --  if in_string(allowedURLS, "_", request_url) then
        return request_url
        -- end
    end

    return octopusBaseUrl
end

function render_url(meetingName, suffix)
    local url = get_url(meetingName)

    return url .. suffix
end

--- Start non-blocking HTTP call
-- @param url URL to call
-- @param options options table as expected by net.http where we provide optional headers, body or method.
-- @param callback if provided, called with callback(response_body, response_code) when call complete.
-- @param timeout_callback if provided, called without args when request times out.
-- @param retries how many times to retry on failure; 0 means no retries.
local function async_http_request(url, options, callback, timeout_callback, retries)
    local completed = false;
    local timed_out = false;
    local retries = retries or api_retry_count;
    http_headers["Authorization"] = storage:get("accessToken")
    local refresh_token = storage:get("refreshToken")

    local function cb_(response_body, response_code)
        if not timed_out then -- request completed before timeout
            completed = true;
            if (response_code == 0 or api_should_retry_for_code(response_code)) and retries > 0 then
                module:log("warn", "API Response code %d. Will retry after %ds", response_code, api_retry_delay);
                timer.add_task(api_retry_delay, function()
                    async_http_request(url, options, callback, timeout_callback, retries - 1)
                end)
                return;
            end

            -- If not authorized
            if (response_code == 401) then
                module:log("warn", "(%d) Unauthorized error will try to refresh tokens and retry", response_code);
                authenticate_octopus(options, async_http_request(url, options, callback, timeout_callback, retries))
            end

            module:log("debug", "%s %s returned code %s", options.method, url, response_code);

            if callback then
                callback(response_body, response_code)
            end
        end
    end

    local request = http.request(url, options, cb_);

    timer.add_task(api_timeout, function()
        timed_out = true;

        if not completed then
            http.destroy_request(request);
            if timeout_callback then
                timeout_callback()
            end
        end
    end);

end

function authenticate_octopus(roomName, cb)
    local body = {}

    local error = nil
    body["refreshToken"], error = storage:get("refreshToken")
    local credJson = json.encode(body)

    async_http_request(get_url(roomName) .. "/v1/auth/client/refresh-token", {
        headers = http_headers,
        method = "POST",
        body = body
    }, function(response_body, response_code)
        if (response_code == 200) then
            local res = json.decode(response_body)
            local ok, err = storage:set("accessToken", res.accessToken)
            ok, err = storage:set("refreshToken", res.refreshToken)
            if err == nil then
                module:log("info", "New tokens saved successfully using refresh token")
                cb()
            end
        elseif (response_code == 401) then
            module:log("info", "Expired refresh token, getting new tokens")

            body = {}
            body["apiKey"] = octopusApiKey
            body["apiSecret"] = octopusApiSecret
            credJson = json.encode(body)

            async_http_request(get_url(roomName) .. "/v1/auth/client/login", {
                headers = http_headers,
                method = "POST",
                body = body
            }, function(response_body, response_code)
                if (response_code == 200) then
                    local res = json.decode(response_body)
                    local ok, err = storage:set("accessToken", res.accessToken)
                    ok, err = storage:set("refreshToken", res.refreshToken)
                    if err == nil then
                        module:log("info", "New tokens saved successfully, got from api key and secret")
                        cb()
                    end
                elseif (response_code == 401) then
                    module:log("info", "Invalid client tokens")

                elseif (response_code == 400) then
                    module:log("info", "Bad request while making request for new tokens")
                end

            end)

        elseif (response_code == 400) then
            module:log("info", "Bad request while refreshing tokens")
        end

    end)
end

--- Returns current timestamp
local function now()
    return os.time();
end

--- Start EventData implementation
local EventData = {};
EventData.__index = EventData;

function new_EventData(room_jid)
    return setmetatable({
        room_jid = room_jid,
        room_name = jid.node(room_jid),
        created_at = now(),
        occupants = {}, -- table of all (past and present) occupants data
        active = {} -- set of active occupants (by occupant jid)
    }, EventData);
end

--- Handle new occupant joining room
function EventData:on_occupant_joined(occupant_jid, event_origin)
    local user_context = event_origin.jitsi_meet_context_user or {};

    -- N.B. we only store user details on join and assume they don't change throughout the duration of the meeting
    local occupant_data = {
        occupant_jid = occupant_jid,
        name = user_context.name,
        id = user_context.id,
        email = user_context.email,
        joined_at = now(),
        left_at = nil
    };

    self.occupants[occupant_jid] = occupant_data;
    self.active[occupant_jid] = true;

    return occupant_data;
end

--- Handle occupant leaving room
function EventData:on_occupant_leave(occupant_jid)
    local left_at = now();
    self.active[occupant_jid] = nil;

    local occupant_data = self.occupants[occupant_jid];
    if occupant_data then
        occupant_data['left_at'] = left_at;
    end

    return occupant_data;
end

--- Returns array of occupant data for all active occupant.
--- @param exclude occupant_jid to exclude form the output
function EventData:get_active_occupant_array(exclude)
    local output = {};
    for _, jid in ipairs(self.active) do
        if jid ~= exclude then
            table.insert(output, self.occupants[jid])
        end
    end

    return output;
end

--- Returns array of all (past or present) occupants
function EventData:get_occupant_array()
    local output = {};
    for _, occupant_data in pairs(self.occupants) do
        table.insert(output, occupant_data)
    end

    return output;
end

--- End EventData implementation

--- Checks if event is triggered by healthchecks or focus user.
function is_system_event(event)
    if is_healthcheck_room(event.room.jid) then
        return true;
    end

    if event.occupant and jid.node(event.occupant.jid) == "focus" then
        return true;
    end

    return false;
end

--- Callback when new room created
function room_created(event)
    if is_system_event(event) then
        return;
    end

    local room = event.room;

    module:log("info", "Start tracking occupants for %s", room.jid);
    local room_data = new_EventData(room.jid);
    room.event_data = room_data;

    async_http_request(render_url(room_data.room_name, URL_EVENT_ROOM_CREATED), {
        headers = http_headers,
        method = "POST",
        body = json.encode({
            ['event_name'] = 'muc-room-created',
            ['room_name'] = room_data.room_name,
            ['room_jid'] = room_data.room_jid,
            ['created_at'] = room_data.created_at
        })
    })
end

--- Callback when room destroyed
function room_destroyed(event)
    if is_system_event(event) then
        return;
    end

    local room = event.room;
    local room_data = room.event_data;
    local destroyed_at = now();

    module:log("info", "Room destroyed - %s", room.jid);

    if not room_data then
        module:log("error", "(room destroyed) Room has no Event data - %s", room.jid);
        return;
    end

    async_http_request(render_url(room_data.room_name, URL_EVENT_ROOM_DESTROYED), {
        headers = http_headers,
        method = "POST",
        body = json.encode({
            ['event_name'] = 'muc-room-destroyed',
            ['room_name'] = room_data.room_name,
            ['room_jid'] = room_data.room_jid,
            ['created_at'] = room_data.created_at,
            ['destroyed_at'] = destroyed_at,
            ['all_occupants'] = room_data:get_occupant_array()
        })
    })
end

--- Callback when an occupant joins room
function occupant_joined(event)
    if is_system_event(event) then
        return;
    end

    local room = event.room;
    local room_data = room.event_data;
    local occupant_jid = event.occupant.jid;

    if not room_data then
        module:log("error", "(occupant joined) Room has no Event data - %s", room.jid);
        return;
    end

    local occupant_data = room_data:on_occupant_joined(occupant_jid, event.origin);
    module:log("info", "New occupant - %s", json.encode(occupant_data));

    async_http_request(render_url(room_data.room_name, URL_EVENT_OCCUPANT_JOINED), {
        headers = http_headers,
        method = "POST",
        body = json.encode({
            ['event_name'] = 'muc-occupant-joined',
            ['room_name'] = room_data.room_name,
            ['room_jid'] = room_data.room_jid,
            ['occupant'] = occupant_data
        })
    })

end

--- Callback when an occupant has left room
function occupant_left(event)
    local room = event.room;

    if is_system_event(event) then
        return;
    end

    local occupant_jid = event.occupant.jid;
    local room_data = room.event_data;

    if not room_data then
        module:log("error", "(occupant left) Room has no Event data - %s", room.jid);
        return;
    end

    local occupant_data = room_data:on_occupant_leave(occupant_jid);
    module:log("info", "Occupant left - %s", json.encode(occupant_data));

    async_http_request(render_url(room_data.room_name, URL_EVENT_OCCUPANT_LEFT), {
        headers = http_headers,
        method = "POST",
        body = json.encode({
            ['event_name'] = 'muc-occupant-left',
            ['room_name'] = room_data.room_name,
            ['room_jid'] = room_data.room_jid,
            ['occupant'] = occupant_data
        })
    })
end

--- Register callbacks on muc events when MUC component is connected
function process_host()
    muc_module:hook("muc-room-created", room_created, -1);
    muc_module:hook("muc-occupant-joined", occupant_joined, -1);
    muc_module:hook("muc-occupant-left", occupant_left, -1);
    muc_module:hook("muc-room-destroyed", room_destroyed, -1);
end

process_host()
