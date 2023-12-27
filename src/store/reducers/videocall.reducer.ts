import {
  CALL_ENDED,
  CALL_ANSWERED,
  INITIATE_CALL,
  ANSWER_CALL,
  LEAVE_CALL,
  INCOMING_CALL,
} from '../constants/videocall.constants';
import { VideoCallActionParam, VideoCallState } from '../types/videocall.types';

const initialState: VideoCallState = {
  incomingCall: null,
  outgoingCall: null,
  activeCall: null,
};

const videoCallReducer = (
  state = initialState,
  action: VideoCallActionParam
): VideoCallState => {
  switch (action.type) {
    case INCOMING_CALL: {
      return {
        ...state,
        incomingCall: action.payload,
      };
    }
    case ANSWER_CALL: {
      return {
        ...state,
        incomingCall: null,
        activeCall: action.payload,
      };
    }
    case INITIATE_CALL: {
      return {
        ...state,
        outgoingCall: action.payload,
      };
    }
    case LEAVE_CALL: {
      return initialState;
    }
    case CALL_ANSWERED: {
      if (state.outgoingCall?.id === action.payload.userId) {
        return {
          ...state,
          outgoingCall: null,
          activeCall: action.payload,
        };
      }
      return {
        ...state,
        incomingCall: action.payload,
      };
    }
    case CALL_ENDED: {
      return initialState;
    }
    default: {
      return state;
    }
  }
};

export default videoCallReducer;
