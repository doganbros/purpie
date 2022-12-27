import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  READ_NOTIFICATION_FAILED,
  READ_NOTIFICATION_REQUESTED,
  READ_NOTIFICATION_SUCCESS,
  VIEW_NOTIFICATION_FAILED,
  VIEW_NOTIFICATION_REQUESTED,
  VIEW_NOTIFICATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
} from '../constants/activity.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { User } from './auth.types';
import { NotificationType } from '../../models/utils';
import { Post } from './post.types';

export interface ZoneSuggestionListItem {
  zone_id: number;
  zone_createdOn: Date;
  zone_name: string;
  zone_displayPhoto: string;
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
  channel_displayPhoto: string;
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

export interface ContactSuggestionListItem {
  userId: number;
  fullName: string;
  email: string;
  userName: string;
  displayPhoto: string;
}

export interface NotificationListItem {
  id: number;
  createdBy: User;
  createdOn: Date;
  message: string;
  counter: number;
  type: NotificationType;
  readOn: Date;
  viewedOn: Date;
  post: Post;
}

export interface NotificationCount {
  unviewedCount: number;
  unreadCount: number;
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
  contactSuggestions: {
    data: ContactSuggestionListItem[];
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
        | typeof CONTACT_SUGGESTIONS_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof NOTIFICATION_REQUESTED
        | typeof NOTIFICATION_COUNT_REQUESTED
        | typeof VIEW_NOTIFICATION_REQUESTED
        | typeof READ_NOTIFICATION_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED;
    }
  | {
      type: typeof ZONE_SUGGESTIONS_SUCCESS;
      payload: PaginatedResponse<ZoneSuggestionListItem>;
    }
  | {
      type: typeof CONTACT_SUGGESTIONS_SUCCESS;
      payload: ContactSuggestionListItem[];
    }
  | {
      type: typeof CHANNEL_SUGGESTIONS_SUCCESS;
      payload: PaginatedResponse<ChannelSuggestionListItem>;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof CONTACT_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED;
      payload: ResponseError;
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
      type: typeof VIEW_NOTIFICATION_SUCCESS;
      payload: number[];
    }
  | {
      type: typeof READ_NOTIFICATION_SUCCESS;
      payload: number;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof NOTIFICATION_FAILED
        | typeof NOTIFICATION_COUNT_FAILED
        | typeof VIEW_NOTIFICATION_FAILED
        | typeof READ_NOTIFICATION_FAILED;
      payload: ResponseError;
    };

export interface ActivityDispatch {
  (dispatch: ActivityActionParams): void;
}

export interface ActivityAction {
  (dispatch: ActivityDispatch): Promise<void>;
}
