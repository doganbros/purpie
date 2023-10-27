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
}

export interface VideoCallState {
  incomingCall: (CallEvent & { user: UserBasic }) | null;
  outgoingCall: null | UserBasic;
  activeCall: (CallEvent & { user: UserBasic }) | null;
}

export type VideoCallActionParam =
  | {
      type: typeof INCOMING_CALL;
      payload: CallEvent & { user: UserBasic };
    }
  | {
      type: typeof ANSWER_CALL;
      payload: CallEvent & { user: UserBasic };
    }
  | { type: typeof CALL_ANSWERED; payload: CallEvent & { user: UserBasic } }
  | { type: typeof INITIATE_CALL; payload: UserBasic }
  | { type: typeof LEAVE_CALL }
  | { type: typeof CALL_ENDED };

export interface VideoCallDispatch {
  (dispatch: VideoCallActionParam): void;
}

export interface VideoCallAction {
  (dispatch: VideoCallDispatch): void;
}
