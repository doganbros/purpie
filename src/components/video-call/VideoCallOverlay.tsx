import React, { FC, useState } from 'react';
import { CallNotification } from './CallNotification';
import { MaximizedCall } from './MaximisedCall';
import { InlineCall } from './InlineCall';

export const VideoCallOverlay: FC = () => {
  const [incomingCall] = useState(null);
  const [activeCall] = useState(null);
  const [isCallMaximized] = useState(false);

  return (
    <>
      {activeCall && (isCallMaximized ? <MaximizedCall /> : <InlineCall />)}
      {incomingCall && <CallNotification />}
    </>
  );
};
