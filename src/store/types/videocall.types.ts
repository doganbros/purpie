import {
  CALL_ENDED,
  CALL_ANSWERED,
  INITIATE_CALL,
  ANSWER_CALL,
  LEAVE_CALL,
  INCOMING_CALL,
} from '../constants/videocall.constants';
import { UserBasic } from './auth.types';

export interface CallEvent {
  socketId: string;
  userId: string;
  meetingRoomName: string;
  meetingToken: string;
  user: {
    avatar?: string;
    name: string;
    email: string;
    id: string;
  };
}

export interface VideoCallState {
  incomingCall: CallEvent | null;
  outgoingCall: null | UserBasic;
  activeCall: CallEvent | null;
}

export type VideoCallActionParam =
  | {
      type: typeof INCOMING_CALL;
      payload: CallEvent;
    }
  | {
      type: typeof ANSWER_CALL;
      payload: CallEvent;
    }
  | { type: typeof CALL_ANSWERED; payload: CallEvent }
  | { type: typeof INITIATE_CALL; payload: UserBasic }
  | { type: typeof LEAVE_CALL }
  | { type: typeof CALL_ENDED };

export interface VideoCallDispatch {
  (dispatch: VideoCallActionParam): void;
}

export interface VideoCallAction {
  (dispatch: VideoCallDispatch): void;
}
