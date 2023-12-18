/* eslint-disable no-console */
import React, {
  FC,
  createContext,
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
  jwt?: string;
  onParticipantLeave?: () => void;
}
const JitsiContextProvider: FC<JitsiContextProviderProps> = ({
  room,
  displayName,
  children,
  jwt,
  onParticipantLeave,
}) => {
  const jitsiConnection = useRef<any>();
  const jitsiConference = useRef<any>();
  const [remoteTracks, setRemoteTracks] = useState<any[]>([]);
  const [localTracks, setLocalTracks] = useState<any[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const streams = useRef<MediaStream | null>(null);

  const onTrackAdded = (track: any) => {
    if (track?.isLocal()) {
      return;
    }
    setRemoteTracks((prev) => [...prev, track]);
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
    if (onParticipantLeave) {
      onParticipantLeave();
    }
  };

  const createLocalTracks = async () => {
    console.log('-------------create-local-tracks-------------');
    if (!jitsiConference.current) {
      return;
    }
    streams.current = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
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
  };

  const removeLocalTracks = () => {
    console.log('-------------remove-local-tracks-------------');
    streams.current?.getTracks().forEach((t) => t.stop());
    jitsiConference.current?.getLocalTracks().forEach((t: any) => {
      jitsiConference.current?.removeTrack(t);
      t.stopStream();
    });
    setLocalTracks([]);
  };

  const jitsiConnectionFailed = () => {
    // FIXME
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
      JitsiMeetJS.events.conference.CONFERENCE_FAILED,
      (e: string) => {
        console.log('conference failed error', e);
      }
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
    if (room && displayName && jwt) {
      JitsiMeetJS.init(JITSI_INIT_CONFIG);

      JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);

      jitsiConnection.current = new JitsiMeetJS.JitsiConnection(
        null,
        jwt,
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
  }, [room, displayName, jwt]);

  const changeDevices = async (
    cameraDeviceId?: string,
    micDeviceId?: string
  ) => {
    jitsiConference.current?.getLocalTracks().forEach((t: any) => {
      jitsiConference.current?.removeTrack(t);
      t.stopStream();
    });

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
  };

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
        changeDevices,
      }}
    >
      {children}
    </JitsiContext.Provider>
  );
};

const useJitsiContext = (): typeof defaultContextValues =>
  useContext(JitsiContext);

export { JitsiContextProvider, useJitsiContext };
