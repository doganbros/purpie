import {
  MembershipActionParams,
  MembershipState,
} from '../types/membership.types';
import {
  GET_USER_MEMBERSHIP_FAILED,
  GET_USER_MEMBERSHIP_REQUESTED,
  GET_USER_MEMBERSHIP_SUCCESS,
  LIST_MEMBERSHIPS_FAILED,
  LIST_MEMBERSHIPS_REQUESTED,
  LIST_MEMBERSHIPS_SUCCESS,
} from '../constants/membership.constants';

const initialState: MembershipState = {
  memberships: {
    data: [],
    loading: false,
    error: null,
  },
  userMembership: null,
};

const membershipReducer = (
  state = initialState,
  action: MembershipActionParams
): MembershipState => {
  switch (action.type) {
    case LIST_MEMBERSHIPS_REQUESTED:
      return {
        ...state,
        memberships: {
          ...state.memberships,
          loading: true,
          error: null,
        },
      };
    case LIST_MEMBERSHIPS_SUCCESS:
      return {
        ...state,
        memberships: {
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case LIST_MEMBERSHIPS_FAILED:
      return {
        ...state,
        memberships: {
          ...state.memberships,
          loading: false,
          error: action.payload,
        },
      };
    case GET_USER_MEMBERSHIP_SUCCESS:
      return {
        ...state,
        userMembership: action.payload,
      };
    case GET_USER_MEMBERSHIP_FAILED:
    case GET_USER_MEMBERSHIP_REQUESTED:
      return {
        ...state,
        userMembership: null,
      };
    default:
      return state;
  }
};

export default membershipReducer;
