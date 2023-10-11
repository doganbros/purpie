import {
  API_KEY_SECRET_FAILED,
  API_KEY_SECRET_REQUESTED,
  API_KEY_SECRET_SUCCESS,
  GENERATE_API_KEY_SECRET_FAILED,
  GENERATE_API_KEY_SECRET_REQUESTED,
  GENERATE_API_KEY_SECRET_SUCCESS,
} from '../constants/api.constants';

export interface ApiKeySecret {
  apiKey: string;
  apiSecret?: string;
}

export type ApiActionsParams =
  | {
      type:
        | typeof API_KEY_SECRET_REQUESTED
        | typeof GENERATE_API_KEY_SECRET_REQUESTED;
    }
  | {
      type:
        | typeof API_KEY_SECRET_SUCCESS
        | typeof GENERATE_API_KEY_SECRET_SUCCESS;
      payload?: ApiKeySecret;
    }
  | {
      type:
        | typeof API_KEY_SECRET_FAILED
        | typeof GENERATE_API_KEY_SECRET_FAILED;

      payload?: string;
    };

export interface ApiDispatch {
  (dispatch: ApiActionsParams): void;
}

export interface ApiAction {
  (dispatch: ApiDispatch): Promise<void | null>;
}
