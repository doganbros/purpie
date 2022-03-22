import {
  ADD_USER_ONLINE,
  REMOVE_USER_ONLINE,
  RESET_CHAT_STATE,
} from '../constants/chat.constants';
import { ChatState } from '../types/chat.types';

const initialState: ChatState = {
  usersOnline: [],
};

const chatReducer = (
  state = initialState,
  action: Record<string, any>
): ChatState => {
  switch (action.type) {
    case ADD_USER_ONLINE:
      return {
        ...state,
        usersOnline: [
          ...state.usersOnline.filter((u) => u !== action.payload),
          action.payload,
        ],
      };
    case REMOVE_USER_ONLINE:
      return {
        ...state,
        usersOnline: state.usersOnline.filter((u) => u !== action.payload),
      };

    case RESET_CHAT_STATE:
      return initialState;
    default:
      return state;
  }
};

export default chatReducer;
