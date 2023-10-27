import React, {
  FC,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { socket } from '../../helpers/socket';

interface CallStartedEvent {
  socketId: string;
  userId: string;
  meetingRoomName: string;
  meetingToken: string;
}
interface VideoCallContextValues {
  incomingCall: CallStartedEvent | null;
  recepientUserId: string | null;
  activeCall: CallStartedEvent | null;
  joinCall: (arg0: CallStartedEvent) => void;
  initiateCall: (arg0: string) => void;
}
const VideoCallContext = createContext<VideoCallContextValues>({
  incomingCall: null,
  recepientUserId: null,
  activeCall: null,
  joinCall: () => {},
  initiateCall: () => {},
});

export const VideoCallContextProvider: FC = ({ children }) => {
  const [incomingCall, setIncomingCall] = useState<CallStartedEvent | null>(
    null
  );
  const [recepientUserId, setRecepientUserId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<CallStartedEvent | null>(null);

  const initiateCall = (userId: string) => {
    socket.emit('join_call', userId);
    setRecepientUserId(userId);
  };

  const joinCall = (callObject: CallStartedEvent) => {
    if (!incomingCall) {
      return;
    }
    socket.emit('join_call', incomingCall.userId);
    setIncomingCall(null);
    setRecepientUserId(null);
    setActiveCall(callObject);
  };
  const handleCallStarted = (e: CallStartedEvent) => {
    if (recepientUserId === e.userId) {
      setActiveCall(e);
      setRecepientUserId(null);
    } else {
      setIncomingCall(e);
    }
  };
  useEffect(() => {
    socket.on('call_started', handleCallStarted);
    return () => {
      socket.off('call_started', handleCallStarted);
    };
  }, [recepientUserId]);

  return (
    <VideoCallContext.Provider
      value={{
        incomingCall,
        recepientUserId,
        activeCall,
        joinCall,
        initiateCall,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};

const useVideoCallContext = () => useContext(VideoCallContext);

export { VideoCallContext, useVideoCallContext };
