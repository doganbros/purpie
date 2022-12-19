import {
  CREATE_CHANNEL_INVITATION_FAILED,
  CREATE_CHANNEL_INVITATION_REQUESTED,
  CREATE_CHANNEL_INVITATION_SUCCESS,
  CREATE_CONTACT_INVITATION_FAILED,
  CREATE_CONTACT_INVITATION_REQUESTED,
  CREATE_CONTACT_INVITATION_SUCCESS,
  CREATE_ZONE_INVITATION_FAILED,
  CREATE_ZONE_INVITATION_REQUESTED,
  CREATE_ZONE_INVITATION_SUCCESS,
  GET_INVITATION_RESPONSE_FAILED,
  GET_INVITATION_RESPONSE_REQUESTED,
  GET_INVITATION_RESPONSE_SUCCESS,
  LIST_INVITATION_FAILED,
  LIST_INVITATION_REQUESTED,
  LIST_INVITATION_SUCCESS,
} from '../constants/invitation.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { InvitationResponseType, InvitationType } from '../../models/utils';
import { User } from './auth.types';

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

export interface InvitationState {
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
  channelInvitations: {
    loading: boolean;
    error: ResponseError | null;
    data: { invitation: InvitationListItem; user: User }[];
  };
  zoneInvitations: {
    loading: boolean;
    error: ResponseError | null;
    data: { invitation: InvitationListItem; user: User }[];
  };
}

export type InvitationActionParams =
  | {
      type:
        | typeof LIST_INVITATION_REQUESTED
        | typeof GET_INVITATION_RESPONSE_REQUESTED
        | typeof CREATE_CONTACT_INVITATION_REQUESTED
        | typeof CREATE_CHANNEL_INVITATION_REQUESTED
        | typeof CREATE_ZONE_INVITATION_REQUESTED;
    }
  | {
      type: typeof CREATE_CONTACT_INVITATION_SUCCESS;
      payload: string;
    }
  | {
      type:
        | typeof CREATE_CHANNEL_INVITATION_SUCCESS
        | typeof CREATE_ZONE_INVITATION_SUCCESS;
      payload: {
        invitation: InvitationListItem;
        user: User;
      };
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
        | typeof LIST_INVITATION_FAILED
        | typeof GET_INVITATION_RESPONSE_FAILED
        | typeof CREATE_CHANNEL_INVITATION_FAILED
        | typeof CREATE_CONTACT_INVITATION_FAILED
        | typeof CREATE_ZONE_INVITATION_FAILED;
      payload: ResponseError;
    };

export interface InvitationDispatch {
  (dispatch: InvitationActionParams): void;
}

export interface InvitationAction {
  (dispatch: InvitationDispatch): Promise<void>;
}
