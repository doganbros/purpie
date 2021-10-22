import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
  PUBLIC_FEED_REQUESTED,
  PUBLIC_FEED_SUCCESS,
  PUBLIC_FEED_FAILED,
  USER_FEED_REQUESTED,
  USER_FEED_SUCCESS,
  USER_FEED_FAILED,
  ZONE_FEED_REQUESTED,
  ZONE_FEED_SUCCESS,
  ZONE_FEED_FAILED,
  CHANNEL_FEED_REQUESTED,
  CHANNEL_FEED_SUCCESS,
  CHANNEL_FEED_FAILED,
  POST_DETAIL_REQUESTED,
  POST_DETAIL_SUCCESS,
  POST_DETAIL_FAILED,
} from '../constants/activity.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import { ChannelBasic } from './channel.types';

export interface ZoneSuggestionListItem {
  zone_id: number;
  zone_createdOn: Date;
  zone_name: string;
  zone_subdomain: string;
  zone_description: string;
  channel_public: boolean;
  category_id: number;
  category_name: string;
  zone_channelCount: string;
  zone_membersCount: string;
}

export interface ChannelSuggestionListItem {
  channel_id: number;
  channel_createdOn: Date;
  channel_name: string;
  channel_topic: string;
  channel_description: string;
  channel_public: boolean;
  zone_id: number;
  zone_name: string;
  zone_subdomain: string;
  category_id: number;
  category_name: string;
  channel_membersCount: string;
}

export enum PostType {
  meeting = 'meeting',
  video = 'video',
}
export interface Tag {
  id: number;
  value: string;
}

export interface Post {
  channel?: ChannelBasic;
  channelId?: number;
  commentsCount: string;
  createdBy: UserBasic;
  createdOn: Date;
  description: string;
  id: number;
  liked: boolean;
  likesCount: string;
  liveStream: boolean;
  public: boolean;
  record: boolean;
  saved: boolean;
  slug: string;
  startDate?: Date;
  tags: Tag[];
  title: string;
  type: PostType;
  userContactExclusive: boolean;
  videoName: string;
}

export interface ActivityState {
  zoneSuggestions: PaginatedResponse<ZoneSuggestionListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  channelSuggestions: PaginatedResponse<ChannelSuggestionListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  feed: PaginatedResponse<Post> & {
    loading: boolean;
    error: ResponseError | null;
  };
  postDetail: {
    loading: boolean;
    error: ResponseError | null;
    data: Post | null;
  };
}

export type ActivityActionParams =
  | {
      type:
        | typeof ZONE_SUGGESTIONS_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof PUBLIC_FEED_REQUESTED
        | typeof USER_FEED_REQUESTED;
    }
  | {
      type: typeof CHANNEL_FEED_REQUESTED;
      payload: {
        channelId: number;
      };
    }
  | {
      type: typeof ZONE_FEED_REQUESTED;
      payload: {
        zoneId: number;
      };
    }
  | {
      type: typeof POST_DETAIL_REQUESTED;
      payload: {
        postId: number;
      };
    }
  | {
      type: typeof ZONE_SUGGESTIONS_SUCCESS;
      payload: PaginatedResponse<ZoneSuggestionListItem>;
    }
  | {
      type: typeof CHANNEL_SUGGESTIONS_SUCCESS;
      payload: PaginatedResponse<ChannelSuggestionListItem>;
    }
  | {
      type:
        | typeof PUBLIC_FEED_SUCCESS
        | typeof USER_FEED_SUCCESS
        | typeof CHANNEL_FEED_SUCCESS
        | typeof ZONE_FEED_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
  | {
      type: typeof POST_DETAIL_SUCCESS;
      payload: Post;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof PUBLIC_FEED_FAILED
        | typeof USER_FEED_FAILED
        | typeof ZONE_FEED_FAILED
        | typeof CHANNEL_FEED_FAILED
        | typeof POST_DETAIL_FAILED;
      payload: ResponseError;
    };

export interface ActivityDispatch {
  (dispatch: ActivityActionParams): void;
}

export interface ActivityAction {
  (dispatch: ActivityDispatch): Promise<void>;
}
