import { socket } from '../../helpers/socket';
import {
  CALL_ENDED,
  CALL_ANSWERED,
  INITIATE_CALL,
  ANSWER_CALL,
  LEAVE_CALL,
  INCOMING_CALL,
} from '../constants/videocall.constants';
import { store } from '../store';
import { UserBasic } from '../types/auth.types';
import { CallEvent, VideoCallAction } from '../types/videocall.types';

export const answerCallAction = (
  payload: CallEvent & { user: UserBasic }
): VideoCallAction => {
  return (dispatch) => {
    socket.emit('join_call', payload.userId);
    dispatch({
      type: ANSWER_CALL,
      payload,
    });
  };
};

export const initiateCallAction = (user: UserBasic): VideoCallAction => {
  return (dispatch) => {
    socket.emit('join_call', user.id);
    dispatch({
      type: INITIATE_CALL,
      payload: user,
    });
  };
};

export const leaveCallAction = (userId: string): VideoCallAction => {
  return (dispatch) => {
    socket.emit('leave_call', userId);
    dispatch({
      type: LEAVE_CALL,
    });
  };
};

const callAnsweredAction = (
  payload: CallEvent & { user: UserBasic }
): VideoCallAction => {
  return (dispatch) =>
    dispatch({
      type: CALL_ANSWERED,
      payload,
    });
};

const handleCallStarted = (e: CallEvent) => {
  const { outgoingCall } = store.getState().videocall;
  if (outgoingCall) {
    callAnsweredAction({ user: outgoingCall, ...e })(store.dispatch);
  } else {
    store.dispatch({ type: INCOMING_CALL, payload: e });
  }
};

socket.on('call_started', handleCallStarted);

const handleCallEnded = (e: CallEvent) => {
  store.dispatch({ type: CALL_ENDED, payload: e });
};

socket.on('call_ended', handleCallEnded);
