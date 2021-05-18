import {
  CLOSE_CREATE_MEETING_LAYER,
  CLOSE_UPDATE_MEETING_LAYER,
  DELETE_MEETINGS_BY_ID_FAILED,
  DELETE_MEETINGS_BY_ID_REQUESTED,
  DELETE_MEETINGS_BY_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_TENANT_ID_FAILED,
  GET_ALL_MEETINGS_BY_TENANT_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_TENANT_ID_SUCCESS,
  GET_ALL_MEETINGS_BY_USER_ID_FAILED,
  GET_ALL_MEETINGS_BY_USER_ID_REQUESTED,
  GET_ALL_MEETINGS_BY_USER_ID_SUCCESS,
  GET_ALL_MEETINGS_FAILED,
  GET_ALL_MEETINGS_REQUESTED,
  GET_ALL_MEETINGS_SUCCESS,
  GET_MEETINGS_BY_ID_FAILED,
  GET_MEETINGS_BY_ID_REQUESTED,
  GET_MEETINGS_BY_ID_SUCCESS,
  MEETING_CREATE_FAILED,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_SUCCESS,
  OPEN_CREATE_MEETING_LAYER,
  OPEN_UPDATE_MEETING_LAYER,
  UPDATE_MEETINGS_BY_ID_FAILED,
  UPDATE_MEETINGS_BY_ID_REQUESTED,
  UPDATE_MEETINGS_BY_ID_SUCCESS,
} from '../constants/meeting.constants';
import { MeetingActionParams, MeetingState } from '../types/meeting.types';

const initialState: MeetingState = {
  getMultipleMeetings: {
    loading: false,
    meetings: null,
    error: null,
  },
  getMultipleMeetingsByTenantId: {
    loading: false,
    meetingsByTenantId: null,
    error: null,
  },
  getMultipleMeetingsByUserId: {
    loading: false,
    meetingsByUserId: null,
    error: null,
  },
  getOneMeeting: {
    loading: false,
    meeting: null,
    error: null,
  },
  createMeeting: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  updateMeetingById: {
    layerIsVisible: false,
    loading: false,
    error: null,
  },
  deleteMeetingById: {
    loading: false,
    error: null,
  },
};

const meetingReducer = (
  state = initialState,
  action: MeetingActionParams
): MeetingState => {
  switch (action.type) {
    case OPEN_CREATE_MEETING_LAYER:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          layerIsVisible: true,
        },
      };
    case CLOSE_CREATE_MEETING_LAYER:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          layerIsVisible: false,
        },
      };
    case OPEN_UPDATE_MEETING_LAYER:
      return {
        ...state,
        updateMeetingById: {
          ...state.updateMeetingById,
          layerIsVisible: true,
        },
      };
    case CLOSE_UPDATE_MEETING_LAYER:
      return {
        ...state,
        updateMeetingById: {
          ...state.updateMeetingById,
          layerIsVisible: false,
        },
      };
    case MEETING_CREATE_REQUESTED:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          loading: true,
        },
      };
    case MEETING_CREATE_SUCCESS:
      return {
        ...state,
        createMeeting: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case MEETING_CREATE_FAILED:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          loading: false,
          error: action.payload,
        },
      };
    case UPDATE_MEETINGS_BY_ID_REQUESTED:
      return {
        ...state,
        updateMeetingById: {
          ...state.updateMeetingById,
          loading: true,
        },
      };
    case UPDATE_MEETINGS_BY_ID_SUCCESS:
      return {
        ...state,
        updateMeetingById: {
          layerIsVisible: false,
          loading: false,
          error: null,
        },
      };
    case UPDATE_MEETINGS_BY_ID_FAILED:
      return {
        ...state,
        updateMeetingById: {
          ...state.updateMeetingById,
          loading: false,
          error: action.payload,
        },
      };
    case DELETE_MEETINGS_BY_ID_REQUESTED:
      return {
        ...state,
        deleteMeetingById: {
          ...state.deleteMeetingById,
          loading: true,
        },
      };
    case DELETE_MEETINGS_BY_ID_SUCCESS:
      return {
        ...state,
        deleteMeetingById: {
          loading: false,
          error: null,
        },
      };
    case DELETE_MEETINGS_BY_ID_FAILED:
      return {
        ...state,
        deleteMeetingById: {
          ...state.deleteMeetingById,
          loading: false,
          error: action.payload,
        },
      };
    case GET_ALL_MEETINGS_REQUESTED:
      return {
        ...state,
        getMultipleMeetings: {
          ...state.getMultipleMeetings,
          loading: true,
        },
      };
    case GET_ALL_MEETINGS_SUCCESS:
      return {
        ...state,
        getMultipleMeetings: {
          meetings: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_ALL_MEETINGS_FAILED:
      return {
        ...state,
        getMultipleMeetings: {
          meetings: null,
          loading: false,
          error: null,
        },
      };
    case GET_ALL_MEETINGS_BY_TENANT_ID_REQUESTED:
      return {
        ...state,
        getMultipleMeetingsByTenantId: {
          ...state.getMultipleMeetingsByTenantId,
          loading: true,
        },
      };
    case GET_ALL_MEETINGS_BY_TENANT_ID_SUCCESS:
      return {
        ...state,
        getMultipleMeetingsByTenantId: {
          meetingsByTenantId: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_ALL_MEETINGS_BY_TENANT_ID_FAILED:
      return {
        ...state,
        getMultipleMeetingsByTenantId: {
          meetingsByTenantId: null,
          loading: false,
          error: null,
        },
      };

    case GET_ALL_MEETINGS_BY_USER_ID_REQUESTED:
      return {
        ...state,
        getMultipleMeetingsByUserId: {
          ...state.getMultipleMeetingsByUserId,
          loading: true,
        },
      };
    case GET_ALL_MEETINGS_BY_USER_ID_SUCCESS:
      return {
        ...state,
        getMultipleMeetingsByUserId: {
          meetingsByUserId: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_ALL_MEETINGS_BY_USER_ID_FAILED:
      return {
        ...state,
        getMultipleMeetingsByUserId: {
          meetingsByUserId: null,
          loading: false,
          error: null,
        },
      };

    case GET_MEETINGS_BY_ID_REQUESTED:
      return {
        ...state,
        getOneMeeting: {
          ...state.getOneMeeting,
          loading: true,
        },
      };
    case GET_MEETINGS_BY_ID_SUCCESS:
      return {
        ...state,
        getOneMeeting: {
          meeting: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_MEETINGS_BY_ID_FAILED:
      return {
        ...state,
        getOneMeeting: {
          meeting: null,
          loading: false,
          error: null,
        },
      };

    default:
      return state;
  }
};

export default meetingReducer;
