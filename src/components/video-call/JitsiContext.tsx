import React, {
  FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  JITSI_CONFERENCE_CONFIG,
  JITSI_CONNECTION_CONFIG,
  defaultContextValues,
  JITSI_INIT_CONFIG,
  enumerateDevices,
} from './utils';

const JitsiContext = createContext(defaultContextValues);

interface JitsiContextProviderProps {
  room?: string;
  displayName?: string;
}
const JitsiContextProvider: FC<JitsiContextProviderProps> = ({
  room,
  displayName,
  children,
}) => {
  const jitsiConnection = useRef<any>();
  const jitsiConference = useRef<any>();
  const [remoteTracks, setRemoteTracks] = useState<any[]>([]);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);

  const onTrackAdded = (track: any) => {
    if (track?.isLocal()) {
      setLocalTracks((prev) => [...prev, track]);
    } else {
      setRemoteTracks((prev) => [...prev, track]);
    }
  };

  const onTrackRemoved = (track: any) => {
    setRemoteTracks((prev) => prev.filter((t) => t.getId() !== track.getId()));
  };

  const onConferenceJoined = () => {
    createLocalTracks();
    setParticipants(jitsiConference.current?.getParticipants());
  };

  const onUserJoined = (id: string, user: any) => {
    setParticipants((prev) => [...prev, user]);
  };

  const onUserLeft = (id: string) => {
    setParticipants((prev) => prev.filter((p) => p._id !== id));
  };

  const createLocalTracks = useCallback(async () => {
    if (!jitsiConference.current) {
      return;
    }
    const mediaDevices = await enumerateDevices();

    const cameraDeviceId = mediaDevices.find((d) => d.kind === 'videoinput')
      ?.deviceId;

    const micDeviceId = mediaDevices.find((d) => d.kind === 'audioinput')
      ?.deviceId;

    const devices = [];

    if (cameraDeviceId) {
      devices.push('video');
    }
    if (micDeviceId) {
      devices.push('audio');
    }

    const tracks = await JitsiMeetJS.createLocalTracks({
      devices,
      cameraDeviceId,
      micDeviceId,
    });

    setLocalTracks(tracks);

    tracks.forEach((t: any) => {
      if (!jitsiConference.current) {
        t.stopStream();
        return;
      }
      jitsiConference.current?.addTrack(t);
    });
  }, [jitsiConference.current]);

  const removeLocalTracks = useCallback(() => {
    jitsiConference.current?.getLocalTracks().forEach((t: any) => {
      if (t.isLocal()) {
        jitsiConference.current?.removeTrack(t);
      }
    });
  }, [jitsiConference.current]);

  const jitsiConnectionFailed = () => {
    console.log('----------------connection failed----------------');
  };

  const jitsiConferenceInit = () => {
    jitsiConference.current = jitsiConnection.current?.initJitsiConference(
      room,
      JITSI_CONFERENCE_CONFIG
    );
    jitsiConference.current?.setDisplayName(displayName);
    jitsiConference.current?.on(
      JitsiMeetJS.events.conference.TRACK_ADDED,
      onTrackAdded
    );
    jitsiConference.current?.on(
      JitsiMeetJS.events.conference.TRACK_REMOVED,
      onTrackRemoved
    );

    jitsiConference.current?.on(
      JitsiMeetJS.events.conference.CONFERENCE_JOINED,
      onConferenceJoined
    );

    jitsiConference.current?.on(
      JitsiMeetJS.events.conference.USER_JOINED,
      onUserJoined
    );

    jitsiConference.current?.on(
      JitsiMeetJS.events.conference.USER_LEFT,
      onUserLeft
    );

    jitsiConference.current?.join();
  };

  const jitsiConnectionEstablished = () => {
    if (!jitsiConnection.current) {
      return;
    }
    jitsiConferenceInit();
  };

  useEffect(() => {
    if (room && displayName) {
      JitsiMeetJS.init(JITSI_INIT_CONFIG);

      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

      jitsiConnection.current = new JitsiMeetJS.JitsiConnection(
        null,
        null,
        JITSI_CONNECTION_CONFIG
      );

      jitsiConnection.current?.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
        jitsiConnectionEstablished
      );

      jitsiConnection.current?.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_FAILED,
        jitsiConnectionFailed
      );

      jitsiConnection.current?.connect();
    }

    return () => {
      removeLocalTracks();
      if (jitsiConference.current) {
        jitsiConference.current?.leave();
      }

      if (jitsiConnection.current) {
        jitsiConnection.current?.disconnect();
      }
    };
  }, [room, displayName]);

  return (
    <JitsiContext.Provider
      value={{
        participants,
        localTracks,
        remoteTracks,
        jitsiConnection,
        jitsiConference,
        createLocalTracks,
        removeLocalTracks,
      }}
    >
      {children}
    </JitsiContext.Provider>
  );
};

const useJitsiContext = () => useContext(JitsiContext);

export { JitsiContextProvider, useJitsiContext };
