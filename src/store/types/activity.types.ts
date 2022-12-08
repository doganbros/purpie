import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  CONTACT_SUGGESTIONS_FAILED,
  CONTACT_SUGGESTIONS_REQUESTED,
  CONTACT_SUGGESTIONS_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
  NOTIFICATION_COUNT_FAILED,
  NOTIFICATION_COUNT_REQUESTED,
  NOTIFICATION_COUNT_SUCCESS,
  NOTIFICATION_FAILED,
  NOTIFICATION_REQUESTED,
  NOTIFICATION_SUCCESS,
  VIEW_NOTIFICATION_FAILED,
  VIEW_NOTIFICATION_REQUESTED,
  VIEW_NOTIFICATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
} from '../constants/activity.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { Post } from './post.types';
import { User } from './auth.types';
import {
  InvitationResponseType,
  InvitationType,
  NotificationType,
} from '../../models/utils';

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

export interface InvitationListItem {
  id: number;
  createdOn: Date;
  createdBy: User;
  zone: InvitationZone;
  channel: InvitationChannel;
  response?: InvitationResponseType;
}

export interface InvitationZone {
  id: number;
  createdOn: Date;
  name: string;
  displayPhoto: string;
  subdomain: string;
  description: string;
  public: boolean;
}

export interface InvitationChannel {
  id: number;
  createdOn: Date;
  name: string;
  displayPhoto: string;
  topic: string;
  description: string;
  public: boolean;
}

export interface InvitationResponse {
  id: number;
  response: InvitationResponseType;
  type: InvitationType;
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
  invitations: PaginatedResponse<InvitationListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  responseInvitation: {
    loading: boolean;
    error: ResponseError | null;
  };
  invitedContacts: {
    loading: boolean;
    error: ResponseError | null;
    userIds: Array<string>;
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
        | typeof LIST_INVITATION_REQUESTED
        | typeof GET_INVITATION_RESPONSE_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof NOTIFICATION_REQUESTED
        | typeof NOTIFICATION_COUNT_REQUESTED
        | typeof VIEW_NOTIFICATION_REQUESTED
        | typeof GET_INVITATION_RESPONSE_REQUESTED
        | typeof CREATE_CONTACT_INVITATION_REQUESTED;
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
      type: typeof CREATE_CONTACT_INVITATION_SUCCESS;
      payload: string;
    }
  | {
      type: typeof LIST_INVITATION_SUCCESS;
      payload: PaginatedResponse<InvitationListItem>;
    }
  | {
      type: typeof GET_INVITATION_RESPONSE_SUCCESS;
      payload: InvitationResponse;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof CONTACT_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof LIST_INVITATION_FAILED
        | typeof GET_INVITATION_RESPONSE_FAILED
        | typeof CREATE_CONTACT_INVITATION_FAILED;
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
      payload: number;
    }
  | {
      type:
        | typeof CHANNEL_SUGGESTIONS_FAILED
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof NOTIFICATION_FAILED
        | typeof NOTIFICATION_COUNT_FAILED
        | typeof VIEW_NOTIFICATION_FAILED;
      payload: ResponseError;
    };

export interface ActivityDispatch {
  (dispatch: ActivityActionParams): void;
}

export interface ActivityAction {
  (dispatch: ActivityDispatch): Promise<void>;
}
