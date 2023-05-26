import {
  REMOVE_USER_ONLINE,
  ADD_USER_ONLINE,
  RESET_CHAT_STATE,
} from '../constants/chat.constants';

export const addUserOnline = (user: string): any => ({
  type: ADD_USER_ONLINE,
  payload: user,
});

export const removeUserOnline = (user: string): any => ({
  type: REMOVE_USER_ONLINE,
  payload: user,
});

export const resetChatState = (): any => ({
  type: RESET_CHAT_STATE,
});
