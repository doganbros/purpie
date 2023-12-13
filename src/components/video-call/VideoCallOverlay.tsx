import React, { FC, useEffect, useRef, useState } from 'react';
import { Layer } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CallNotification } from './CallNotification';
import { MaximizedCall } from './MaximizedCall';
import { MinimizedCall } from './MinimizedCall';
import { NotifiicationList } from './NotificationList';
import { JitsiContextProvider } from './JitsiContext';
import { AppState } from '../../store/reducers/root.reducer';
import {
  answerCallAction,
  leaveCallAction,
} from '../../store/actions/videocall.action';
import { OutgoingCall } from './OutgoingCall';
import { RemoteAudio } from './RemoteAudio';
import CallSound from '../../assets/call-sound.mp3';

export const VideoCallOverlay: FC = () => {
  const [isCallMaximized, setIsCallMaximized] = useState(false);
  const {
    auth: { user },
    videocall: { activeCall, incomingCall, outgoingCall },
  } = useSelector((state: AppState) => state);
  const callSoundRef = useRef(new Audio(CallSound));

  const dispatch = useDispatch();

  useEffect(() => {
    if (!activeCall) {
      setIsCallMaximized(false);
    }
  }, [activeCall]);

  useEffect(() => {
    callSoundRef.current.loop = true;
    if (incomingCall) {
      callSoundRef.current.play();
    } else {
      callSoundRef.current.pause();
      callSoundRef.current.currentTime = 0;
    }
  }, [!!incomingCall]);

  return (
    <JitsiContextProvider
      onParticipantLeave={
        activeCall
          ? () => dispatch(leaveCallAction(activeCall.userId))
          : undefined
      }
      displayName={user?.fullName}
      room={activeCall?.meetingRoomName}
      jwt={activeCall?.meetingToken}
    >
      {/* The video rendering component will change based on the chosen layout, while the
      audio will consistently remain active, so we handle its rendering
      independently. */}

      {activeCall && <RemoteAudio />}

      {activeCall && isCallMaximized && (
        <Layer animate={false}>
          <MaximizedCall
            onDismiss={() => {
              setIsCallMaximized(false);
            }}
          />
        </Layer>
      )}

      <NotifiicationList>
        {activeCall && !isCallMaximized && (
          <MinimizedCall
            name={activeCall.user.name}
            onClickVideo={() => setIsCallMaximized(true)}
            onEndCall={() => dispatch(leaveCallAction(activeCall.userId))}
          />
        )}
        {incomingCall && (
          <CallNotification
            name={incomingCall.user.name}
            onAccept={() => dispatch(answerCallAction(incomingCall))}
            onReject={() => dispatch(leaveCallAction(incomingCall.userId))}
          />
        )}
        {outgoingCall && (
          <OutgoingCall
            name={outgoingCall.fullName}
            onEndCall={() => dispatch(leaveCallAction(outgoingCall.id))}
          />
        )}
      </NotifiicationList>
    </JitsiContextProvider>
  );
};
