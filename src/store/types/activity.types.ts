import {
  CHANNEL_SUGGESTIONS_FAILED,
  CHANNEL_SUGGESTIONS_REQUESTED,
  CHANNEL_SUGGESTIONS_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
  ZONE_SUGGESTIONS_FAILED,
  ZONE_SUGGESTIONS_REQUESTED,
  ZONE_SUGGESTIONS_SUCCESS,
} from '../constants/activity.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { InvitationResponseType, InvitationType } from '../../models/utils';
import { User } from './auth.types';

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
  channel_description: string;
  channel_public: boolean;
  zone_id: number;
  zone_name: string;
  zone_subdomain: string;
  category_id: number;
  category_name: string;
  channel_membersCount: string;
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
  description: string;
  public: boolean;
}

export interface InvitationResponse {
  id: number;
  response: InvitationResponseType;
  type: InvitationType;
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
  invitations: PaginatedResponse<InvitationListItem> & {
    loading: boolean;
    error: ResponseError | null;
  };
  responseInvitation: {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type ActivityActionParams =
  | {
      type:
        | typeof ZONE_SUGGESTIONS_REQUESTED
        | typeof CHANNEL_SUGGESTIONS_REQUESTED
        | typeof LIST_INVITATION_REQUESTED
        | typeof GET_INVITATION_RESPONSE_REQUESTED;
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
        | typeof ZONE_SUGGESTIONS_FAILED
        | typeof LIST_INVITATION_FAILED
        | typeof GET_INVITATION_RESPONSE_FAILED;
      payload: ResponseError;
    };

export interface ActivityDispatch {
  (dispatch: ActivityActionParams): void;
}

export interface ActivityAction {
  (dispatch: ActivityDispatch): Promise<void>;
}
