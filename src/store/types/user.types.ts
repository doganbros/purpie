import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
  LIST_USER_CONTACTS_REQUESTED,
  LIST_USER_CONTACTS_SUCCESS,
  LIST_USER_CONTACTS_FAILED,
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

export interface ContactUser {
  id: number;
  createdOn: Date;
  contactUser: UserBasic;
}
export interface UserState {
  search: {
    results: PaginatedResponse<UserBasic>;
    loading: boolean;
    error: ResponseError | null;
  };
  contacts: PaginatedResponse<ContactUser> & {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type UserActionParams =
  | {
      type: typeof LIST_USER_CONTACTS_REQUESTED;
    }
  | {
      type: typeof SEARCH_PROFILE_REQUESTED;
      payload: ProfileSearchParams;
    }
  | {
      type: typeof SEARCH_PROFILE_SUCCESS;
      payload: PaginatedResponse<UserBasic>;
    }
  | {
      type: typeof LIST_USER_CONTACTS_SUCCESS;
      payload: PaginatedResponse<ContactUser>;
    }
  | {
      type: typeof SEARCH_PROFILE_FAILED | typeof LIST_USER_CONTACTS_FAILED;
      payload: ResponseError;
    };

export interface UserDispatch {
  (dispatch: UserActionParams): void;
}

export interface UserAction {
  (dispatch: UserDispatch): Promise<void>;
}
