import React, { FC, useEffect, useState } from 'react';
import { Layer } from 'grommet';
import { CallNotification } from './CallNotification';
import { MaximizedCall } from './MaximisedCall';
import { InlineCall } from './InlineCall';
import { socket } from '../../helpers/socket';
import { NotifiicationList } from './NotificationList';
import { JitsiContextProvider } from './VideoCallContext';

export const VideoCallOverlay: FC = () => {
  const [incomingCall, setIncomingCall] = useState<any>(null);
  const [activeCall] = useState(true);
  const [isCallMaximized, setIsCallMaximized] = useState(true);

  useEffect(() => {
    socket.on('call_started', (e) => setIncomingCall(e));
  }, []);

  return (
    <JitsiContextProvider displayName="Test User" room={null}>
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
        {incomingCall && <CallNotification />}
      </NotifiicationList>
    </JitsiContextProvider>
  );
};
