import { ResponseError } from '../../models/response-error';
import { Category } from '../../models/utils';
import {
  GET_USER_CHANNELS_FAILED,
  GET_USER_CHANNELS_REQUESTED,
  GET_USER_CHANNELS_SUCCESS,
  JOIN_CHANNEL_FAILED,
  JOIN_CHANNEL_REQUESTED,
  JOIN_CHANNEL_SUCCESS,
} from '../constants/channel.constants';
import { User } from './auth.types';
import { ZoneActionParams } from './zone.types';

export interface ChannelListItem {
  id: number;
  name: string;
  topic: string;
  description: string;
  public: boolean;
  createdBy?: User;
  category?: Category;
  zoneId: number;
}

export interface UserChannelListItem {
  id: number;
  createdOn: Date;
  channel: ChannelListItem;
}

export interface UserChannelDetail extends UserChannelListItem {
  channel: Required<ChannelListItem>;
}

export interface ChannelState {
  userChannels: {
    data: UserChannelListItem[];
    loading: boolean;
    error: ResponseError | null;
  };
  joinChannel: {
    loading: boolean;
    error: ResponseError | null;
  };
}

export type ChannelActionParams =
  | {
      type: typeof GET_USER_CHANNELS_SUCCESS;
      payload: UserChannelListItem[];
    }
  | {
      type: typeof JOIN_CHANNEL_REQUESTED;
      payload: number;
    }
  | {
      type: typeof JOIN_CHANNEL_SUCCESS | typeof GET_USER_CHANNELS_REQUESTED;
    }
  | {
      type: typeof JOIN_CHANNEL_FAILED | typeof GET_USER_CHANNELS_FAILED;
      payload: ResponseError;
    };

export interface ChannelDispatch {
  (dispatch: ChannelActionParams | ZoneActionParams): void;
}

export interface ChannelAction {
  (dispatch: ChannelDispatch): Promise<void>;
}
