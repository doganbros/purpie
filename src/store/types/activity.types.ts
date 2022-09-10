import {
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CHANNEL_SUGGESTIONS_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_SUCCESS,
} from '../constants/activity.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { ChannelBasic } from './channel.types';
import { PostComment, PostType } from './post.types';
import { UserBasic } from './auth.types';

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

export interface NotificationListItem {
  id: number;
  createdOn: Date;
  message: string;
  counter: number;
  type: 'post_like';
  readOn: Date;
  viewedOn: Date;
  post: {
    id: number;
    createdOn: Date;
    title: string;
    description: string;
    slug: string;
    type: PostType;
    public: boolean;
    videoName: string;
    userContactExclusive: boolean;
    postReaction: {
      id: number;
      createdOn: Date;
      updatedOn: Date;
      likesCount: number;
      dislikesCount: number;
      commentsCount: number;
      viewsCount: number;
      liveStreamViewersCount: number;
      postId: number;
    };
    channel: ChannelBasic;
    createdBy: UserBasic;
    postComment: PostComment;
  };
}

export interface NotificationCount {
  unviewedCount: string;
  unreadCount: string;
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
  notification: PaginatedResponse<NotificationListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  notificationCount: NotificationCount & {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type ActivityActionParams =
  | {
      type:
        | typeof ZONE_SUGGESTIONS_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof NOTIFICATION_REQUESTED
        | typeof NOTIFICATION_COUNT_REQUESTED;
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
      type: typeof NOTIFICATION_SUCCESS;
      payload: PaginatedResponse<NotificationListItem>;
    }
  | {
      type: typeof NOTIFICATION_COUNT_SUCCESS;
      payload: NotificationCount;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof NOTIFICATION_FAILED
        | typeof NOTIFICATION_COUNT_FAILED;
      payload: ResponseError;
    };

export interface ActivityDispatch {
  (dispatch: ActivityActionParams): void;
}

export interface ActivityAction {
  (dispatch: ActivityDispatch): Promise<void>;
}
