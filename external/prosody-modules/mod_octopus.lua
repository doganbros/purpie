local main_util = module:require "util";
local http_post_with_retry = main_util.http_post_with_retry;
local http_get_with_retry = main_util.http_get_with_retry;
local json = require 'util.json'
local jid = require("util.jid")

module:log("info", "loading Octopus module")
local is_healthcheck_room = module:require "util".is_healthcheck_room;
local storage = module:open_store();
local octopusBaseUrl = module:get_option_string('octopusAPIBaseUrl');
function authenticate_octopus()
    local body = {};
      
    local error = nil;
    body["refreshToken"],error =  storage:get("refreshToken");
    local credJson = json.encode(body);
    local response = http_post_with_retry(octopusBaseUrl .. 'auth/client/refresh-token', 1, credJson);
   
    if response == 401 or response == 403 or response == 400 then
      body = {};
      body["apiKey"] = module:get_option_string('octopusApiKey');
      body["apiSecret"] =  module:get_option_string('octopusApiSecret');
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
    
    -- for key, value in pairs(event.occupant:get_presence()) do
    --   module.log("info", "New occupant object pair");
    --   module:log("info", "Occupant object pairs : " .. key);
    --   module:log("info", "Occupant object pairs: %s", value);
    --  end

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
    
    

    local room, occupant = event.room, event.occupant;    
    local nick, audiomuted, videomuted;
    local name_text;;
    local child_identity, child_user, child_name;
    if is_healthcheck_room(room.jid) then
      return;
    end
    local jid_resource = require "util.jid".resource;
    local room_name = jid.node(event.room.jid);
    local nick = jid_resource(occupant.nick);


   
   for _, pr in occupant:each_session() do
     nick = pr:get_child_text("nick", "http://jabber.org/protocol/nick") or "";
     audiomuted = pr:get_child_text("audiomuted", "http://jitsi.org/jitmeet/audio") or "";
     videomuted = pr:get_child_text("videomuted", "http://jitsi.org/jitmeet/video") or "";
    


    -- module.log("info", "Name search step 2", name_text); 

    --  name_text = pr:get_child_text("presence");
    --  module:log("info", "Name search step 3", name_text, pr.presence ); 

    -- name_text = pr:get_child_text("name");
    -- module.log("info", "Name search step 4", name_text); 

    -- identiy_child = pr:get_child("identity");
    -- module.log("info", "Name search step 5", identity_child);

    -- name_text = pr:get_child("identity"):get_child("user"):get_child_text("name") or "";;
    -- module.log("info", "Name search step 6", name_text); 
     
     --module.log("info", "Listing occupant session object pairs");

    --  for key1, value1 in pairs(pr) do
    --      --module.log("info", "New occupant session object pair");

    --      module:log("info", "Occupant session object pairs key:" .. key1);
    --      module:log("info", "Occupant session object pairs value: %s", value1);
    --  end
     
    --  for key2, value2 in pairs(pr.tags) do
    --      --module.log("info", "New occupant session object pair");

    --      module:log("info", "Occupant session tag object pairs key:" .. key2);
    --      module:log("info", "Occupant session tag object pairs value: %s", value2);
    --  end

    --  for key3, value3 in pairs(pr.attr) do
    --      --module.log("info", "New occupant session object pair");

    --      module:log("info", "Occupant session attr object pairs key:" .. key3);
    --      module:log("info", "Occupant session attr object pairs value: %s", value3);
    --  end

   end
--local ip = event.request.ip;
    local bare_jid = occupant.bare_jid;

    -- module:log("info", "room %s: join %s, role %s", room, nick, role);
    module:log("info", "New Occupant Joined Room :%s User ID: %s  Nick:%s Role:%s Bare Jid:%s", room, userId, nick, role, bare_jid);
    -- module:log("info", "room %s: role: %s", room, role);

end


function occupant_left(event)
    module:log("info", "********************************************One occupant left******************************************")
    local room, occupant = event.room, event.occupant;
    local nick, audiomuted, videomuted;

    local temp = occupant:get_presence();

    local room_name = jid.node(event.room.jid);
    local userId = occupant:get_presence():get_child('identity');
    
    -- local usernick = occupant:get_presence():get_child_text('nick', 'http://jabber.org/protocol/nick')
    
    -- module:log("info", "********************************************************User Nick: %s", usernick);
    
    
    -- for key, value in pairs(occupant:get_presence():get_child_text('nick')) do
    --   module.log("info", "New occupant object pair");
    --   module:log("info", "Occupant object keys : " .. key);
    --   module:log("info", "Occupant object values: %s", value);
    -- end
     
     if userId ~= nil then
        userId = userId:get_child("user"):get_child_text("id");
        userId = tonumber(userId);
        local response = send_event(room_name, 'user_left', userId);
        if response == 401 then
            authenticate_octopus();
            send_event(room_name, 'user_left', userId);
        end
    end

    if is_healthcheck_room(room.jid) then
      return;
    end
    local jid_resource = require "util.jid".resource;
    --local nick = jid_resource(occupant.nick);
    --local nick = occupant.session[1].nick;
    if jid_resource(occupant.nick) then
      module:log("info", "Occupant jid resource nick : ", jid_resource(occupant.nick));
    end  

    --if occupant.session[1].nick then
    --  module:log("info", "Occupant session nick : ", occupant.session[1].nic);
    --end  



--   end

    for _, pr in occupant:each_session() do
      nick = pr:get_child_text("nick", "http://jabber.org/protocol/nick") or "";
      audiomuted = pr:get_child_text("audiomuted", "http://jitsi.org/jitmeet/audio") or "";
      videomuted = pr:get_child_text("videomuted", "http://jitsi.org/jitmeet/video") or "";

    --   module.log("info", "Listing occupant session object pairs");

    --   for key1, value1 in pairs(pr) do
    --      module.log("info", "New occupant session object pair");

    --      module:log("info", "Occupant session object pairs key: " .. key1);
    --      module:log("info", "Occupant session object pairs value: %s", value1);
    --   end

    --   for key2, value2 in pairs(pr.tags) do
    --      module.log("info", "New occupant session tag object pair");

    --      module:log("info", "Occupant session tag object pairs key: " .. key2);
    --      module:log("info", "Occupant session tag object pairs value: %s", value2);
    --   end

    --   for key3, value3 in pairs(pr.attr) do
    --      module.log("info", "New occupant session attr object pair");

    --      module:log("info", "Occupant session attr object pairs key: " .. key3);
    --      module:log("info", "Occupant session attr object pairs value: %s", value3);
    --   end

   end

--local ip = event.request.ip;
    local role = '';
    if occupant.role then
        role = occupant.role
    end
    local bare_jid = occupant.bare_jid;
    --module:log("info", "room %s: join %s, role %s, ip %s", room, nick, role, ip);
    module:log("info", "Occupant Left Room :%s  Nick:%s Role:%s Bare Jid:%s", room, nick, role, bare_jid);
    --module:log("info", "room %s: role: %s", room, role);
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

module:hook("muc-occupant-joined", occupant_joined, 150);
module:hook("muc-occupant-pre-leave", occupant_left, 151);
-- module:hook("muc-occupant-left", occupant_left, 152);
module:hook("muc-room-created", room_created, 152);
module:hook("muc-room-destroyed", room_destroyed, 153);


