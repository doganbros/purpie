import { ResponseError } from '../../models/response-error';
import {
  GET_USER_MEMBERSHIP_FAILED,
  GET_USER_MEMBERSHIP_REQUESTED,
  GET_USER_MEMBERSHIP_SUCCESS,
  LIST_MEMBERSHIPS_FAILED,
  LIST_MEMBERSHIPS_REQUESTED,
  LIST_MEMBERSHIPS_SUCCESS,
} from '../constants/membership.constants';

export enum MembershipType {
  FREE = 'FREE',
  ESSENTIAL = 'ESSENTIAL',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface Membership {
  id: string;
  type: MembershipType;
  price: number;
  actions: {
    channelCount: number;
    zoneCount: number;
    meetingCount: number;
    streamCount: number;
    webinarCount: number;
    streamingStudioCount: number;
    meetingDuration: number;
    meetingMaxParticipantCount: number;
    streamMeeting: number;
    videoSize: number;
  };
}

export interface MembershipState {
  memberships: {
    data: Membership[];
    loading: boolean;
    error: ResponseError | null;
  };
  userMembership: Membership | null;
}

export type MembershipActionParams =
  | {
      type:
        | typeof LIST_MEMBERSHIPS_REQUESTED
        | typeof GET_USER_MEMBERSHIP_REQUESTED;
    }
  | {
      type: typeof LIST_MEMBERSHIPS_SUCCESS;
      payload: Membership[];
    }
  | {
      type: typeof GET_USER_MEMBERSHIP_SUCCESS;
      payload: Membership;
    }
  | {
      type: typeof LIST_MEMBERSHIPS_FAILED | typeof GET_USER_MEMBERSHIP_FAILED;
      payload: ResponseError;
    };

export interface MembershipDispatch {
  (dispatch: MembershipActionParams): void;
}

export interface MembershipAction {
  (dispatch: MembershipDispatch): Promise<void>;
}
