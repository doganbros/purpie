import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
} from '../constants/user.constants';

export interface ProfileSearchOptions {
  excludeIds?: string;
  channelId?: number;
  userContacts?: boolean;
}
export interface ProfileSearchParams extends ProfileSearchOptions {
  name: string;
  limit?: number;
  skip?: number;
}

export interface UserState {
  search: {
    results: PaginatedResponse<UserBasic>;
    loading: boolean;
    error: ResponseError | null;
  };
}

export type UserActionParams =
  | {
      type: typeof SEARCH_PROFILE_REQUESTED;
      payload: ProfileSearchParams;
    }
  | {
      type: typeof SEARCH_PROFILE_SUCCESS;
      payload: PaginatedResponse<UserBasic>;
    }
  | {
      type: typeof SEARCH_PROFILE_FAILED;
      payload: ResponseError;
    };

export interface UserDispatch {
  (dispatch: UserActionParams): void;
}

export interface UserAction {
  (dispatch: UserDispatch): Promise<void>;
}
