/* eslint-disable */
// @ts-nocheck

import React, {
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
} from './utils';

const JitsiContext = createContext(defaultContextValues);

const JitsiContextProvider = ({ room, displayName, children }) => {
  const jitsiConnection = useRef();
  const jitsiConference = useRef();
  const [remoteTracks, setRemoteTracks] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [participants, setParticipants] = useState([]);

  const onTrackAdded = (track) => {
    setRemoteTracks((prev) => [...prev, track]);
  };

  const onTrackRemoved = (track) => {
    setRemoteTracks((prev) => prev.filter((t) => t.getId() !== track.getId()));
  };

  const onConferenceJoined = () => {
    createLocalTracks();
    setParticipants(jitsiConference.current?.getParticipants());
  };

  const onUserJoined = (id, user) => {
    setParticipants((prev) => [...prev, user]);
  };

  const onUserLeft = (id) => {
    setParticipants((prev) => prev.filter((p) => p._id !== id));
  };

  const createLocalTracks = useCallback(() => {
    if (!jitsiConference.current) {
      return;
    }

    JitsiMeetJS.mediaDevices?.enumerateDevices((mediaDevices) => {
      let cameraDeviceId;
      let micDeviceId;
      mediaDevices.forEach((d) => {
        if (d.kind === 'videoinput') {
          cameraDeviceId = d.deviceId;
        } else {
          micDeviceId = d.deviceId;
        }
      });
      JitsiMeetJS.createLocalTracks({
        devices: ['video', 'audio'],
        cameraDeviceId,
        micDeviceId,
      })
        .then((ts) => {
          setLocalTracks(ts);
          ts.forEach((t) => {
            if (!jitsiConference.current) {
              t.stopStream();
              return;
            }
            jitsiConference.current
              ?.addTrack(t)
              .catch((e) => console.log('track add error', e));
          });
        })
        .catch((err) => {
          console.log('----------------local track error----------------');
          console.log(err);
        });
    });
  }, [jitsiConference.current]);

  const removeLocalTracks = useCallback(() => {
    jitsiConference.current?.getLocalTracks().forEach((t) => {
      if (t.isLocal()) {
        jitsiConference.current?.removeTrack(t);
      }
    });
  }, [jitsiConference.current]);

  const jitsiConnectionFailed = () => {
    console.log('----------------connection failed----------------');
  };

  const jitsiConnectionDisconnected = () => {
    console.log('----------------connection disconnected----------------');
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
      JitsiMeetJS.events.conference.CONFERENCE_LEFT,
      () => {}
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
    console.log('----------------connection established----------------');
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

      jitsiConnection.current?.addEventListener(
        JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
        jitsiConnectionDisconnected
      );

      JitsiMeetJS.mediaDevices.addEventListener(
        JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED,
        (devices) => {
          console.log('devices', { devices });
        }
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
