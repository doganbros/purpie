import { ResponseError } from '../../models/response-error';
import {
  MEETING_CREATE_SUCCESS,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_FAILED,
  OPEN_CREATE_MEETING_LAYER,
  CLOSE_CREATE_MEETING_LAYER,
  OPEN_UPDATE_MEETING_LAYER,
  CLOSE_UPDATE_MEETING_LAYER,
  OPEN_PLAN_A_MEETING_LAYER,
  CLOSE_PLAN_A_MEETING_LAYER,
  OPEN_UPDATE_PLAN_A_MEETING_LAYER,
  CLOSE_UPDATE_PLAN_A_MEETING_LAYER,
  GET_USER_MEETING_CONFIG_REQUESTED,
  GET_USER_MEETING_CONFIG_SUCCESS,
  GET_USER_MEETING_CONFIG_FAILED,
  PLAN_A_MEETING_DIALOG_FORWARD,
  PLAN_A_MEETING_DIALOG_BACK,
  PLAN_A_MEETING_DIALOG_SET,
  SET_INITIAL_MEETING_FORM,
  SET_MEETING_FORM_FIELD,
  GET_USER_SUGGESTIONS_FOR_MEETING_REQUESTED,
  GET_USER_SUGGESTIONS_FOR_MEETING_SUCCESS,
  GET_USER_SUGGESTIONS_FOR_MEETING_FAILED,
  ADD_USER_TO_INVITATION,
  REMOVE_USER_FROM_INVITATION,
} from '../constants/meeting.constants';
import { User } from './auth.types';
import { ChannelListItem } from './channel.types';

import { UtilActionParams } from './util.types';
import { PostActionParams } from './post.types';

export interface Meeting {
  id: number;
  title: string;
  slug: string;
  description: string;
  startDate: string;
  public: string;
  channel: ChannelListItem;
  createdOn: Date;
  createdBy: User;
}
export interface CreateMeetingPayload {
  title?: string;
  description?: string;
  startDate?: string | null;
  endDate?: string | null;
  channelId?: number | null;
  public?: boolean | null;
  config?: Record<string, any> | null;
  saveConfig?: boolean;
  planForLater?: boolean;
  record?: boolean;
  liveStream?: boolean;
  invitationIds?: Array<number>;
  timeZone?: string;
}

export type UpdateMeetingPayload = Partial<CreateMeetingPayload>;

interface MeetingPrivacyConfig {
  public: boolean;

  liveStream: boolean;

  record: boolean;
}

export interface UserMeetingConfig {
  jitsiConfig: Record<string, any>;

  privacyConfig: MeetingPrivacyConfig;
}

export interface MeetingState {
  showPlanMeetingLayer: boolean;
  showMeetNowLayer: boolean;
  userMeetingConfig: {
    loading: boolean;
    config: UserMeetingConfig | null;
    error: ResponseError | null;
  };
  createMeeting: {
    invitedUsers: Array<User>;
    userSuggestions: Array<User>;
    planDialogCurrentIndex: number;
    form: {
      payload: CreateMeetingPayload | null;
      submitting: boolean;
      error: ResponseError | null;
    };
  };
}

export type MeetingActionParams =
  | {
      type:
        | typeof MEETING_CREATE_REQUESTED
        | typeof MEETING_CREATE_SUCCESS
        | typeof GET_USER_SUGGESTIONS_FOR_MEETING_REQUESTED
        | typeof OPEN_CREATE_MEETING_LAYER
        | typeof CLOSE_CREATE_MEETING_LAYER
        | typeof PLAN_A_MEETING_DIALOG_FORWARD
        | typeof PLAN_A_MEETING_DIALOG_BACK
        | typeof OPEN_PLAN_A_MEETING_LAYER
        | typeof CLOSE_PLAN_A_MEETING_LAYER
        | typeof GET_USER_MEETING_CONFIG_REQUESTED
        | typeof OPEN_UPDATE_PLAN_A_MEETING_LAYER
        | typeof CLOSE_UPDATE_PLAN_A_MEETING_LAYER
        | typeof OPEN_UPDATE_MEETING_LAYER
        | typeof CLOSE_UPDATE_MEETING_LAYER;
    }
  | {
      type:
        | typeof MEETING_CREATE_FAILED
        | typeof GET_USER_SUGGESTIONS_FOR_MEETING_FAILED
        | typeof GET_USER_MEETING_CONFIG_FAILED;
      payload: ResponseError;
    }
  | {
      type: typeof GET_USER_SUGGESTIONS_FOR_MEETING_SUCCESS;
      payload: Array<User>;
    }
  | {
      type: typeof ADD_USER_TO_INVITATION;
      payload: User;
    }
  | {
      type: typeof GET_USER_MEETING_CONFIG_SUCCESS;
      payload: UserMeetingConfig;
    }
  | {
      type:
        | typeof PLAN_A_MEETING_DIALOG_SET
        | typeof REMOVE_USER_FROM_INVITATION;
      payload: number;
    }
  | {
      type: typeof SET_INITIAL_MEETING_FORM;
      payload: CreateMeetingPayload;
    }
  | {
      type: typeof SET_MEETING_FORM_FIELD;
      payload: Partial<CreateMeetingPayload>;
    };

export interface MeetingDispatch {
  (dispatch: MeetingActionParams | UtilActionParams | PostActionParams): void;
}

export interface MeetingAction {
  (dispatch: MeetingDispatch): Promise<void>;
}
