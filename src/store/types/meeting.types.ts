import { ResponseError } from '../../models/response-error';
import {
  MEETING_CREATE_SUCCESS,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_FAILED,
  GET_ALL_MEETINGS_REQUESTED,
  GET_MEETINGS_BY_ID_REQUESTED,
  GET_ALL_MEETINGS_SUCCESS,
  GET_ALL_MEETINGS_FAILED,
  GET_MEETINGS_BY_ID_SUCCESS,
  GET_MEETINGS_BY_ID_FAILED,
  GET_ALL_MEETINGS_BY_USER_ZONE_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_USER_ZONE_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_USER_ZONE_ID_FAILED,
  GET_ALL_MEETINGS_BY_USER_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_USER_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_USER_ID_FAILED,
  OPEN_CREATE_MEETING_LAYER,
  CLOSE_CREATE_MEETING_LAYER,
  DELETE_MEETINGS_BY_ID_REQUESTED,
  DELETE_MEETINGS_BY_ID_SUCCESS,
  UPDATE_MEETINGS_BY_ID_SUCCESS,
  UPDATE_MEETINGS_BY_ID_REQUESTED,
  UPDATE_MEETINGS_BY_ID_FAILED,
  DELETE_MEETINGS_BY_ID_FAILED,
  OPEN_UPDATE_MEETING_LAYER,
  CLOSE_UPDATE_MEETING_LAYER,
} from '../constants/meeting.constants';
import { CLOSE_UPDATE_USER_ZONE_LAYER } from '../constants/zone.constants';
import { UtilActionParams } from './util.types';

export interface Meeting {
  id: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  link: string;
  zoneId: number;
  creatorId: number;
  createdAt: Date;
}

export interface CreateMeetingPayload {
  zoneId: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
}

export type UpdateMeetingPayload = Partial<CreateMeetingPayload>;

export interface MeetingState {
  getMultipleMeetings: {
    loading: boolean;
    meetings: Array<Meeting> | null;
    error: ResponseError | null;
  };
  getMultipleMeetingsByZoneId: {
    loading: boolean;
    meetingsByZoneId: Array<Meeting> | null;
    error: ResponseError | null;
  };
  getMultipleMeetingsByUserId: {
    loading: boolean;
    meetingsByUserId: Array<Meeting> | null;
    error: ResponseError | null;
  };
  getOneMeeting: {
    loading: boolean;
    meeting: Meeting | null;
    error: ResponseError | null;
  };
  createMeeting: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
  deleteMeetingById: {
    loading: boolean;
    error: ResponseError | null;
  };
  updateMeetingById: {
    layerIsVisible: boolean;
    loading: boolean;
    error: ResponseError | null;
  };
}

export type MeetingActionParams =
  | {
      type:
        | typeof MEETING_CREATE_REQUESTED
        | typeof GET_ALL_MEETINGS_REQUESTED
        | typeof DELETE_MEETINGS_BY_ID_REQUESTED
        | typeof GET_ALL_MEETINGS_BY_USER_ZONE_ID_REQUESTED
        | typeof GET_ALL_MEETINGS_BY_USER_ID_REQUESTED
        | typeof MEETING_CREATE_SUCCESS
        | typeof DELETE_MEETINGS_BY_ID_SUCCESS
        | typeof UPDATE_MEETINGS_BY_ID_SUCCESS
        | typeof UPDATE_MEETINGS_BY_ID_REQUESTED
        | typeof OPEN_CREATE_MEETING_LAYER
        | typeof CLOSE_CREATE_MEETING_LAYER
        | typeof OPEN_UPDATE_MEETING_LAYER
        | typeof CLOSE_UPDATE_USER_ZONE_LAYER
        | typeof CLOSE_UPDATE_MEETING_LAYER
        | typeof GET_MEETINGS_BY_ID_REQUESTED;
    }
  | {
      type:
        | typeof GET_ALL_MEETINGS_SUCCESS
        | typeof GET_ALL_MEETINGS_BY_USER_ZONE_ID_SUCCESS
        | typeof GET_ALL_MEETINGS_BY_USER_ID_SUCCESS;
      payload: Array<Meeting>;
    }
  | {
      type: typeof GET_MEETINGS_BY_ID_SUCCESS;
      payload: Meeting;
    }
  | {
      type:
        | typeof GET_ALL_MEETINGS_FAILED
        | typeof GET_MEETINGS_BY_ID_FAILED
        | typeof GET_ALL_MEETINGS_BY_USER_ZONE_ID_FAILED
        | typeof GET_ALL_MEETINGS_BY_USER_ID_FAILED
        | typeof UPDATE_MEETINGS_BY_ID_FAILED
        | typeof DELETE_MEETINGS_BY_ID_FAILED
        | typeof MEETING_CREATE_FAILED;
      payload: ResponseError;
    };

export interface MeetingDispatch {
  (dispatch: MeetingActionParams | UtilActionParams): void;
}

export interface MeetingAction {
  (dispatch: MeetingDispatch): Promise<void>;
}
