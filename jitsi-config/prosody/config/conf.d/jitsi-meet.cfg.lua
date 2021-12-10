












admins = {
    "focus@auth.meet.jitsi",
    "jvb@auth.meet.jitsi"
}

unlimited_jids = {
    "focus@auth.meet.jitsi",
    "jvb@auth.meet.jitsi"
}

plugin_paths = { "/prosody-plugins/", "/prosody-plugins-custom" }

muc_mapper_domain_base = "meet.jitsi";
muc_mapper_domain_prefix = "muc";

http_default_host = "meet.jitsi"









consider_bosh_secure = true;

-- Deprecated in 0.12
-- https://github.com/bjc/prosody/commit/26542811eafd9c708a130272d7b7de77b92712de




  

cross_domain_websocket = { "https://docker.octopus.doganbros.com","https://meet.jitsi" }
cross_domain_bosh = { "https://docker.octopus.doganbros.com","https://meet.jitsi" }


VirtualHost "meet.jitsi"

    authentication = "jitsi-anonymous"

    ssl = {
        key = "/config/certs/meet.jitsi.key";
        certificate = "/config/certs/meet.jitsi.crt";
    }
    modules_enabled = {
        "bosh";
        
        "websocket";
        "smacks"; -- XEP-0198: Stream Management
        
        "pubsub";
        "ping";
        "speakerstats";
        "conference_duration";
        
        
        "muc_lobby_rooms";
        
        
        "av_moderation";
        
        
        
    }

    
    main_muc = "muc.meet.jitsi"
    lobby_muc = "lobby.meet.jitsi"
    
    muc_lobby_whitelist = { "recorder.meet.jitsi" }
    
    

    speakerstats_component = "speakerstats.meet.jitsi"
    conference_duration_component = "conferenceduration.meet.jitsi"

    
    av_moderation_component = "avmoderation.meet.jitsi"
    

    c2s_require_encryption = false



VirtualHost "auth.meet.jitsi"
    ssl = {
        key = "/config/certs/auth.meet.jitsi.key";
        certificate = "/config/certs/auth.meet.jitsi.crt";
    }
    modules_enabled = {
        "limits_exception";
    }
    authentication = "internal_hashed"


VirtualHost "recorder.meet.jitsi"
    modules_enabled = {
      "ping";
    }
    authentication = "internal_hashed"


Component "internal-muc.meet.jitsi" "muc"
    storage = "memory"
    modules_enabled = {
        "ping";
        }
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true

Component "muc.meet.jitsi" "muc"
    storage = "memory"
    modules_enabled = {
        "muc_meeting_id";
        "polls";
        }
    muc_room_cache_size = 1000
    muc_room_locking = false
    muc_room_default_public_jids = true

Component "focus.meet.jitsi" "client_proxy"
    target_address = "focus@auth.meet.jitsi"

Component "speakerstats.meet.jitsi" "speakerstats_component"
    muc_component = "muc.meet.jitsi"

Component "conferenceduration.meet.jitsi" "conference_duration_component"
    muc_component = "muc.meet.jitsi"


Component "avmoderation.meet.jitsi" "av_moderation_component"
    muc_component = "muc.meet.jitsi"



Component "lobby.meet.jitsi" "muc"
    storage = "memory"
    restrict_room_creation = true
    muc_room_locking = false
    muc_room_default_public_jids = true

