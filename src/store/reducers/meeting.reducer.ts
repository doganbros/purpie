import {
  ADD_USER_TO_INVITATION,
  CLOSE_CREATE_MEETING_LAYER,
  CLOSE_PLAN_A_MEETING_LAYER,
  GET_USER_MEETING_CONFIG_FAILED,
  GET_USER_MEETING_CONFIG_REQUESTED,
  GET_USER_MEETING_CONFIG_SUCCESS,
  GET_USER_SUGGESTIONS_FOR_MEETING_SUCCESS,
  MEETING_CREATE_FAILED,
  MEETING_CREATE_REQUESTED,
  MEETING_CREATE_SUCCESS,
  OPEN_CREATE_MEETING_LAYER,
  OPEN_PLAN_A_MEETING_LAYER,
  PLAN_A_MEETING_DIALOG_BACK,
  PLAN_A_MEETING_DIALOG_FORWARD,
  PLAN_A_MEETING_DIALOG_SET,
  REMOVE_USER_FROM_INVITATION,
  SET_INITIAL_MEETING_FORM,
  SET_MEETING_FORM_FIELD,
} from '../constants/meeting.constants';
import { MeetingActionParams, MeetingState } from '../types/meeting.types';

const initialState: MeetingState = {
  showPlanMeetingLayer: false,
  showMeetNowLayer: false,
  userMeetingConfig: {
    loading: false,
    config: null,
    error: null,
  },
  createMeeting: {
    invitedUsers: [],
    userSuggestions: [],
    planDialogCurrentIndex: 0,
    form: {
      payload: null,
      submitting: false,
      error: null,
    },
  },
};

const meetingReducer = (
  state = initialState,
  action: MeetingActionParams
): MeetingState => {
  switch (action.type) {
    case SET_INITIAL_MEETING_FORM:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          form: {
            ...state.createMeeting.form,
            payload: action.payload,
          },
        },
      };
    case SET_MEETING_FORM_FIELD:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          form: {
            ...state.createMeeting.form,
            payload: {
              ...state.createMeeting.form.payload,
              ...action.payload,
            },
          },
        },
      };
    case GET_USER_SUGGESTIONS_FOR_MEETING_SUCCESS:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          userSuggestions: action.payload,
        },
      };
    case ADD_USER_TO_INVITATION:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          invitedUsers: [...state.createMeeting.invitedUsers, action.payload],
        },
      };
    case REMOVE_USER_FROM_INVITATION:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          invitedUsers: state.createMeeting.invitedUsers.filter(
            (v) => v.value !== action.payload
          ),
        },
      };

    case OPEN_CREATE_MEETING_LAYER:
      return {
        ...state,
        showMeetNowLayer: true,
        createMeeting: {
          ...state.createMeeting,
          form: {
            payload: null,
            submitting: false,
            error: null,
          },
        },
      };
    case CLOSE_CREATE_MEETING_LAYER:
      return {
        ...state,
        showMeetNowLayer: false,
        createMeeting: initialState.createMeeting,
      };
    case OPEN_PLAN_A_MEETING_LAYER:
      return {
        ...state,
        showPlanMeetingLayer: true,
        createMeeting: {
          ...state.createMeeting,
          planDialogCurrentIndex: 0,
          form: {
            payload: null,
            submitting: false,
            error: null,
          },
        },
      };
    case CLOSE_PLAN_A_MEETING_LAYER:
      return {
        ...state,
        showPlanMeetingLayer: false,
        createMeeting: initialState.createMeeting,
      };

    case GET_USER_MEETING_CONFIG_REQUESTED:
      return {
        ...state,
        userMeetingConfig: {
          ...state.userMeetingConfig,
          loading: true,
          error: null,
        },
      };
    case GET_USER_MEETING_CONFIG_SUCCESS:
      return {
        ...state,
        userMeetingConfig: {
          config: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_USER_MEETING_CONFIG_FAILED:
      return {
        ...state,
        userMeetingConfig: {
          config: null,
          loading: false,
          error: action.payload,
        },
      };

    case MEETING_CREATE_REQUESTED:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          form: {
            ...state.createMeeting.form,
            submitting: true,
            error: null,
          },
        },
      };
    case MEETING_CREATE_SUCCESS:
      return {
        ...state,
        showPlanMeetingLayer: false,
        showMeetNowLayer: false,
        createMeeting: initialState.createMeeting,
      };
    case MEETING_CREATE_FAILED:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          form: {
            ...state.createMeeting.form,
            submitting: false,
            error: action.payload,
          },
        },
      };
    case PLAN_A_MEETING_DIALOG_FORWARD:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          planDialogCurrentIndex:
            state.createMeeting.planDialogCurrentIndex + 1,
        },
      };
    case PLAN_A_MEETING_DIALOG_BACK:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          planDialogCurrentIndex:
            state.createMeeting.planDialogCurrentIndex - 1,
        },
      };
    case PLAN_A_MEETING_DIALOG_SET:
      return {
        ...state,
        createMeeting: {
          ...state.createMeeting,
          planDialogCurrentIndex: action.payload,
        },
      };

    default:
      return state;
  }
};

export default meetingReducer;
