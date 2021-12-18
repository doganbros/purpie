local json = require 'util.json'
local jid = require("util.jid")
local http = require "net.http";
local timer = require "util.timer";
local st = require "util.stanza";
local have_async, async = pcall(require, "util.async");
local is_healthcheck_room = module:require "util".is_healthcheck_room;

local http_headers = {
    ["User-Agent"] = "Prosody ("..prosody.version.."; "..prosody.platform..")",
    ["Content-Type"] = "application/json"
};
local http_timeout = 30;
local storage = module:open_store();
local octopusBaseUrl = os.getenv("OCTOPUS_URL");
local octopusApiKey = os.getenv("OCTOPUS_API_KEY");
local octopusApiSecret = os.getenv("OCTOPUS_API_SECRET");

module:log("info", "loading Octopus module")

function http_post_with_retry(url, retry, reqBody, accessToken)
    local content, code;
    local timeout_occurred;
    local wait, done = async.waiter();
    local function cb(content_, code_, response_, request_)
        if timeout_occurred == nil then
            code = code_;
            if code == 200 or code == 204 or code == 201 then
                module:log("debug", "External call was successful, content %s", content_);
                content = content_
            else
                module:log("warn", "POST REQUEST Error  on public key request: Code %s, Content %s",
                    code_, content_);

                content = code;
            end
            done();
        else
            module:log("warn", "External call reply delivered after timeout from: %s", url);
        end
    end

    http_headers['Authorization'] = accessToken or '';
    local function call_http()
        return http.request(url, {
            headers = http_headers or {},
            method = "POST",
            body = reqBody
        }, cb);
    end

    local request = call_http();

    local function cancel()
        -- TODO: This check is racey. Not likely to be a problem, but we should
        --       still stick a mutex on content / code at some point.
        if code == nil then
            timeout_occurred = true;
            module:log("warn", "Timeout %s seconds making the external call to: %s", http_timeout, url);
            -- no longer present in prosody 0.11, so check before calling
            if http.destroy_request ~= nil then
                http.destroy_request(request);
            end
            if retry == nil then
                module:log("debug", "External call failed and retry policy is not set");
                done();
            elseif retry ~= nil and retry < 1 then
                module:log("debug", "External call failed after retry")
                done();
            else
                module:log("debug", "External call failed, retry nr %s", retry)
                retry = retry - 1;
                request = call_http()
                return http_timeout;
            end
        end
    end
    timer.add_task(http_timeout, cancel);
    wait();

    return content;
end

function authenticate_octopus()
    local body = {};
      
    local error = nil;
    body["refreshToken"],error =  storage:get("refreshToken");
    local credJson = json.encode(body);
    local response = http_post_with_retry(octopusBaseUrl .. 'auth/client/refresh-token', 1, credJson);
   
    if response == 401 or response == 403 or response == 400 then
      body = {};
      body["apiKey"] = octopusApiKey;
      body["apiSecret"] =  octopusApiSecret;
      credJson = json.encode(body);

      response = http_post_with_retry(octopusBaseUrl .. 'auth/client/login', 1, credJson);
      if response == 403 then
        module:log("warn", "not authorized");
      elseif response == 400 then
        module:log("warn", "bad request");
      else 
        response = json.decode(response);
        local ok, err = storage:set("accessToken",  response.accessToken);
        ok, err = storage:set("refreshToken",  response.refreshToken);
        if err == nil then
          module:log("info", "new tokens saved successfully using API Key");
        end
      end       
    else 
     
      response = json.decode(response);
      local ok, err = storage:set("accessToken",  response.accessToken);
      ok, err = storage:set("refreshToken",  response.refreshToken);
      if err == nil then
        module:log("info", "new tokens saved successfully using refresh token");
      end
    end 
    return response.accessToken;
end

function send_event(meetingTitle, event, userId)

    local body = {};
    body['meetingTitle'] = meetingTitle;
    body['event'] = event;
    if userId ~= nil then
        body['userId'] = userId;
    end
    local accessToken =  storage:get("accessToken");
    body = json.encode(body);
    if accessToken ~= nil then
        accessToken = "Bearer " .. accessToken;
    end
    local response = http_post_with_retry(octopusBaseUrl ..'meeting/client/event', 1, body, accessToken);
   
    if response == 401 or response == 403 or response == 400 then
        module:log("info", "[send_event] error exist", event);
        return response
    else 
        module:log("info", "[send_event] successfully sent", event);
    end 
end

function occupant_joined(event)
    module:log("info", "********************************************New occupant join******************************************")

    local userId = event.occupant:get_presence():get_child('identity');
    if userId ~= nil then
        userId = userId:get_child("user"):get_child_text("id");
        userId = tonumber(userId);
    end
    if event.occupant.role then
        role = event.occupant.role;
        if event.occupant.role ~= 'moderator' then
            local room_name = jid.node(event.room.jid);
            local response = send_event(room_name, 'user_joined', userId);
            if response == 401 then
                authenticate_octopus();
                send_event(room_name, 'user_joined', userId);
            end
        end
    end
end


function occupant_left(event)
    module:log("info", "********************************************One occupant left******************************************")

    local room_name = jid.node(event.room.jid);
    local userId = event.occupant:get_presence():get_child('identity');
    
     if userId ~= nil then
        userId = userId:get_child("user"):get_child_text("id");
        userId = tonumber(userId);
        local response = send_event(room_name, 'user_left', userId);
        if response == 401 then
            authenticate_octopus();
            send_event(room_name, 'user_left', userId);
        end
    end
end

function occupant_pre_joined(event)
    local userId = event.stanza:get_child('identity');
    if userId ~= nil then
        userId = userId:get_child("user"):get_child_text("id");
        userId = tonumber(userId);
    else 
        return nil;
    end
    module:log("info", "********************************************User Pre Join******************************************", userId)

    local body = {};
    body['meetingTitle'] = jid.node(event.room.jid);
    body['userId'] = userId;

    local accessToken =  storage:get("accessToken");
    body = json.encode(body);
    if accessToken ~= nil then
        accessToken = "Bearer " .. accessToken;
    end
    local response = http_post_with_retry(octopusBaseUrl ..'meeting/client/verify', 1, body, accessToken);
    
    if response == 401 then
        module:log("info", "[verify user joining meeting] error exist", response);
        authenticate_octopus();
        return occupant_pre_joined(event)
    else if response == 404  or response == 400 then 
        module:log("info", "[verify user joining meeting] not found");
        local session, stanza = event.origin, event.stanza;

        session.send(
            st.error_reply(
                stanza, "cancel", "not-allowed", "Room modification disabled for guests"));
        return true;
    else 
        module:log("info", "[verify user joining meeting] successfully sent", response);
    end 
    end
end

function room_created(event)
    module:log("info", "********************************************Room is started******************************************")
    local room_name = jid.node(event.room.jid);
    local response = send_event(room_name, 'started');
    if response == 401 then
        authenticate_octopus();
        send_event(room_name, 'started');
    end
end

function room_destroyed(event)
    module:log("info", "********************************************Room is Finished******************************************")
    local room_name = jid.node(event.room.jid);
    local response = send_event(room_name, 'ended');
    if response == 401 then
        authenticate_octopus();
        send_event(room_name, 'ended');
    end
    
end

module:hook("muc-occupant-pre-join", occupant_pre_joined, 150);
module:hook("muc-occupant-joined", occupant_joined, 151);
module:hook("muc-occupant-pre-leave", occupant_left, 152);
-- module:hook("muc-occupant-left", occupant_left, 152);
module:hook("muc-room-created", room_created, 153);
module:hook("muc-room-destroyed", room_destroyed, 154);




