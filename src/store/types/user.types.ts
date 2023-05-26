import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { User, UserBasic } from './auth.types';
import {
  GET_USER_DETAIL_FAILED,
  GET_USER_DETAIL_REQUESTED,
  GET_USER_DETAIL_SUCCESS,
  LIST_CONTACTS_FAILED,
  LIST_CONTACTS_REQUESTED,
  LIST_CONTACTS_SUCCESS,
  LIST_USER_PUBLIC_CHANNELS_FAILED,
  LIST_USER_PUBLIC_CHANNELS_REQUESTED,
  LIST_USER_PUBLIC_CHANNELS_SUCCESS,
  LIST_USER_PUBLIC_ZONES_FAILED,
  LIST_USER_PUBLIC_ZONES_REQUESTED,
  LIST_USER_PUBLIC_ZONES_SUCCESS,
  REMOVE_CONTACT_FAILED,
  REMOVE_CONTACT_REQUESTED,
  REMOVE_CONTACT_SUCCESS,
  SEARCH_PROFILE_FAILED,
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SELECT_CONTACT_FAILED,
  SELECT_CONTACT_REQUESTED,
  SELECT_CONTACT_SUCCESS,
  UPDATE_CONTACT_LAST_ONLINE_DATE,
} from '../constants/user.constants';
import { UserChannelListItem } from './channel.types';
import { UserZoneListItem } from './zone.types';

export interface ProfileSearchOptions {
  excludeIds?: string[];
  channelId?: string;
  userContacts?: boolean;
}

export interface ProfileSearchParams extends ProfileSearchOptions {
  name: string;
  limit?: number;
  skip?: number;
}

export interface ContactUser {
  id: string;
  createdOn: Date;
  contactUser: User;
  lastOnlineDate: Date;
}

export interface UserState {
  search: {
    results: PaginatedResponse<User>;
    loading: boolean;
    error: ResponseError | null;
  };
  contacts: PaginatedResponse<ContactUser> & {
    loading: boolean;
    error: ResponseError | null;
    selected: {
      contactId: string | null;
      user: User | null;
      loading: boolean;
      error: ResponseError | null;
    };
  };
  publicChannels: PaginatedResponse<UserChannelListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  publicZones: PaginatedResponse<UserZoneListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  detail: {
    user: User | null;
    loading: boolean;
    error: ResponseError | null;
    selected: {
      user: User | null;
      loading: boolean;
      error: ResponseError | null;
    };
  };
}

export type UserActionParams =
  | {
      type:
        | typeof LIST_CONTACTS_REQUESTED
        | typeof LIST_USER_PUBLIC_CHANNELS_REQUESTED
        | typeof LIST_USER_PUBLIC_ZONES_REQUESTED;
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
      type: typeof LIST_CONTACTS_SUCCESS;
      payload: PaginatedResponse<ContactUser>;
    }
  | {
      type: typeof LIST_USER_PUBLIC_CHANNELS_SUCCESS;
      payload: PaginatedResponse<UserChannelListItem>;
    }
  | {
      type: typeof LIST_USER_PUBLIC_ZONES_SUCCESS;
      payload: PaginatedResponse<UserZoneListItem>;
    }
  | {
      type: typeof SELECT_CONTACT_REQUESTED;
      payload: {
        userName: string;
        contactId: string;
      };
    }
  | {
      type: typeof GET_USER_DETAIL_REQUESTED;
      payload: {
        userName: string;
      };
    }
  | {
      type: typeof SELECT_CONTACT_SUCCESS | typeof GET_USER_DETAIL_SUCCESS;
      payload: User;
    }
  | {
      type: typeof REMOVE_CONTACT_REQUESTED | typeof REMOVE_CONTACT_SUCCESS;
      payload: {
        contactId: string;
      };
    }
  | {
      type: typeof UPDATE_CONTACT_LAST_ONLINE_DATE;
      contactUserId: string;
    }
  | {
      type:
        | typeof SEARCH_PROFILE_FAILED
        | typeof LIST_CONTACTS_FAILED
        | typeof SELECT_CONTACT_FAILED
        | typeof REMOVE_CONTACT_FAILED
        | typeof GET_USER_DETAIL_FAILED
        | typeof LIST_USER_PUBLIC_CHANNELS_FAILED
        | typeof LIST_USER_PUBLIC_ZONES_FAILED;
      payload: ResponseError;
    };

export interface UserDispatch {
  (dispatch: UserActionParams): void;
}

export interface UserAction {
  (dispatch: UserDispatch): Promise<void>;
}
