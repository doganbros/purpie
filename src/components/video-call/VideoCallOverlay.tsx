import React, { FC, useState } from 'react';
import { Layer } from 'grommet';
import { CallNotification } from './CallNotification';
import { MaximizedCall } from './MaximisedCall';
import { InlineCall } from './InlineCall';
import { NotifiicationList } from './NotificationList';
import { JitsiContextProvider } from './JitsiContext';
import { useVideoCallContext } from './VideoCallContext';

export const VideoCallOverlay: FC = () => {
  const [isCallMaximized, setIsCallMaximized] = useState(false);
  const { activeCall, incomingCall, joinCall } = useVideoCallContext();

  return (
    <JitsiContextProvider displayName="Test User" room={undefined}>
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
          <InlineCall onClickVideo={() => setIsCallMaximized(true)} />
        )}
        {incomingCall && (
          <CallNotification onAccept={() => joinCall(incomingCall)} />
        )}
      </NotifiicationList>
    </JitsiContextProvider>
  );
};
