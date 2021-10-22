import { UserBasic } from './auth.types';
import { ChannelBasic } from './channel.types';
import {
  VIDEO_CREATE_REQUESTED,
  VIDEO_CREATE_SUCCESS,
  VIDEO_CREATE_FAILED,
  VIDEO_DETAIL_REQUESTED,
  VIDEO_DETAIL_SUCCESS,
  VIDEO_DETAIL_FAILED,
} from '../constants/video.constants';
import { ResponseError } from '../../models/response-error';

export interface CreateVideoPayload {
  title: string;
  description?: string;
  channelId?: number;
  public?: boolean;
  userContactExclusive?: boolean;
  videoFile: Buffer;
}

export interface VideoDetail {
  id: number;
  description: string;
  slug: string;
  public: boolean;
  videoName: string;
  userContactExclusive: boolean;
  createdBy: UserBasic;
  tags: { value: string }[];
  channel?: ChannelBasic;
}

export interface VideoState {
  videoDetails: VideoDetail;
  loading: boolean;
  error: ResponseError | null;
}

export type VideoActionParams =
  | {
      type: typeof VIDEO_CREATE_REQUESTED;
      payload: CreateVideoPayload;
    }
  | {
      type: typeof VIDEO_DETAIL_REQUESTED;
      payload: {
        videoId: number;
      };
    }
  | {
      type: typeof VIDEO_CREATE_SUCCESS;
    }
  | {
      type: typeof VIDEO_DETAIL_SUCCESS;
      payload: VideoDetail;
    }
  | {
      type: typeof VIDEO_CREATE_FAILED | typeof VIDEO_DETAIL_FAILED;
      payload: ResponseError;
    };

export interface VideoDispatch {
  (dispatch: VideoActionParams): void;
}

export interface VideoAction {
  (dispatch: VideoDispatch): Promise<void>;
}
