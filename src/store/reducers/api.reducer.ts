import {
  API_KEY_SECRET_SUCCESS,
  GENERATE_API_KEY_SECRET_SUCCESS,
} from '../constants/api.constants';
import { ApiActionsParams, ApiKeySecret } from '../types/api.types';

const initialState: ApiKeySecret = {
  apiKey: '',
  apiSecret: '',
};

const apiReducer = (
  state = initialState,
  action: ApiActionsParams
): ApiKeySecret => {
  switch (action.type) {
    case API_KEY_SECRET_SUCCESS:
      return {
        ...state,
        apiKey: action?.payload?.apiKey || '',
        apiSecret: action?.payload?.apiSecret || '',
      };

    case GENERATE_API_KEY_SECRET_SUCCESS:
      return {
        ...state,
        apiKey: action?.payload?.apiKey || '',
        apiSecret: action?.payload?.apiSecret || '',
      };

    default:
      return state;
  }
};

export default apiReducer;
