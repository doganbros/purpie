import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import { ChannelListItem } from './channel.types';
import { ZoneListItem } from './zone.types';
import {
  SEARCH_CHANNEL_REQUESTED,
  SEARCH_CHANNEL_SUCCESS,
  SEARCH_CHANNEL_FAILED,
  SEARCH_ZONE_REQUESTED,
  SEARCH_ZONE_SUCCESS,
  SEARCH_ZONE_FAILED,
  SEARCH_USER_REQUESTED,
  SEARCH_USER_SUCCESS,
  SEARCH_USER_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  SEARCH_POST_FAILED,
} from '../constants/search.constants';
import { Post } from './post.types';

export enum SearchScope {
  zone = 'zone',
  channel = 'channel',
  user = 'user',
  post = 'post',
}

export interface PostSearchParams {
  searchTerm: string;
  following?: boolean;
  streaming?: boolean;
  limit?: number;
  skip?: number;
}

export interface ZoneSearchParams {
  searchTerm: string;
  limit?: number;
  skip?: number;
}

export interface UserSearchParams {
  name: string;
  limit?: number;
  skip?: number;
  excludeIds?: string;
  channelId?: number;
  userContacts?: boolean;
  excludeCurrentUser?: boolean;
}

export interface ChannelSearchParams {
  searchTerm: string;
  limit?: number;
  skip?: number;
}

export type SearchResults =
  | ({
      scope: typeof SearchScope.channel;
    } & PaginatedResponse<ChannelListItem>)
  | ({ scope: typeof SearchScope.zone } & PaginatedResponse<ZoneListItem>)
  | ({ scope: typeof SearchScope.user } & PaginatedResponse<UserBasic>)
  | ({ scope: typeof SearchScope.post } & PaginatedResponse<Post>);

export interface SearchState {
  loading: boolean;
  error: ResponseError | null;
  searchResults: SearchResults | null;
}

export type SearchActionParams =
  | {
      type: typeof SEARCH_CHANNEL_REQUESTED;
      payload: ChannelSearchParams;
    }
  | {
      type: typeof SEARCH_ZONE_REQUESTED;
      payload: ZoneSearchParams;
    }
  | {
      type: typeof SEARCH_USER_REQUESTED;
      payload: UserSearchParams;
    }
  | {
      type: typeof SEARCH_POST_REQUESTED;
      payload: PostSearchParams;
    }
  | {
      type: typeof SEARCH_CHANNEL_SUCCESS;
      payload: PaginatedResponse<ChannelListItem>;
    }
  | {
      type: typeof SEARCH_ZONE_SUCCESS;
      payload: PaginatedResponse<ZoneListItem>;
    }
  | {
      type: typeof SEARCH_USER_SUCCESS;
      payload: PaginatedResponse<UserBasic>;
    }
  | {
      type: typeof SEARCH_POST_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
  | {
      type:
        | typeof SEARCH_CHANNEL_FAILED
        | typeof SEARCH_USER_FAILED
        | typeof SEARCH_ZONE_FAILED
        | typeof SEARCH_POST_FAILED;
      payload: ResponseError;
    };

export interface SearchDispatch {
  (dispatch: SearchActionParams): void;
}

export interface SearchAction {
  (dispatch: SearchDispatch): Promise<void>;
}
