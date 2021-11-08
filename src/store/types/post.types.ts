import {
  PUBLIC_FEED_REQUESTED,
  PUBLIC_FEED_SUCCESS,
  PUBLIC_FEED_FAILED,
  USER_FEED_REQUESTED,
  USER_FEED_SUCCESS,
  USER_FEED_FAILED,
  ZONE_FEED_REQUESTED,
  ZONE_FEED_SUCCESS,
  ZONE_FEED_FAILED,
  CHANNEL_FEED_REQUESTED,
  CHANNEL_FEED_SUCCESS,
  CHANNEL_FEED_FAILED,
  POST_DETAIL_REQUESTED,
  POST_DETAIL_SUCCESS,
  POST_DETAIL_FAILED,
  CREATE_VIDEO_REQUESTED,
  CREATE_VIDEO_SUCCESS,
  CREATE_VIDEO_FAILED,
  OPEN_CREATE_VIDEO_LAYER,
  CLOSE_CREATE_VIDEO_LAYER,
  CREATE_POST_LIKE_REQUESTED,
  CREATE_POST_LIKE_SUCCESS,
  CREATE_POST_LIKE_FAILED,
  REMOVE_POST_LIKE_REQUESTED,
  REMOVE_POST_LIKE_SUCCESS,
  REMOVE_POST_LIKE_FAILED,
} from '../constants/post.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import { ChannelBasic } from './channel.types';

export enum PostType {
  meeting = 'meeting',
  video = 'video',
}

export interface Post {
  channel?: ChannelBasic;
  channelId?: number;
  commentsCount: string;
  createdBy: UserBasic;
  createdOn: Date;
  description: string;
  id: number;
  liked: boolean;
  likesCount: string;
  liveStream: boolean;
  public: boolean;
  record: boolean;
  saved: boolean;
  slug: string;
  startDate?: Date;
  title: string;
  type: PostType;
  userContactExclusive: boolean;
  videoName: string;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  channelId?: number;
  public?: boolean;
  userContactExclusive?: boolean;
  videoFile: File;
}

export interface PostState {
  feed: PaginatedResponse<Post> & {
    loading: boolean;
    error: ResponseError | null;
  };
  postDetail: {
    loading: boolean;
    error: ResponseError | null;
    data: Post | null;
  };
  createVideo: {
    showCreateVideoLayer: boolean;
    uploading: boolean;
    error: ResponseError | null;
  };
}

export type PostActionParams =
  | {
      type: typeof PUBLIC_FEED_REQUESTED | typeof USER_FEED_REQUESTED;
    }
  | {
      type: typeof CHANNEL_FEED_REQUESTED;
      payload: {
        channelId: number;
      };
    }
  | {
      type: typeof ZONE_FEED_REQUESTED;
      payload: {
        zoneId: number;
      };
    }
  | {
      type:
        | typeof POST_DETAIL_REQUESTED
        | typeof CREATE_POST_LIKE_REQUESTED
        | typeof REMOVE_POST_LIKE_REQUESTED;
      payload: {
        postId: number;
      };
    }
  | {
      type: typeof CREATE_VIDEO_REQUESTED;
      payload: CreateVideoPayload;
    }
  | {
      type:
        | typeof PUBLIC_FEED_SUCCESS
        | typeof USER_FEED_SUCCESS
        | typeof CHANNEL_FEED_SUCCESS
        | typeof ZONE_FEED_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
  | {
      type: typeof POST_DETAIL_SUCCESS;
      payload: Post;
    }
  | {
      type:
        | typeof CREATE_VIDEO_SUCCESS
        | typeof OPEN_CREATE_VIDEO_LAYER
        | typeof CLOSE_CREATE_VIDEO_LAYER
        | typeof CREATE_POST_LIKE_SUCCESS
        | typeof REMOVE_POST_LIKE_SUCCESS;
    }
  | {
      type:
        | typeof PUBLIC_FEED_FAILED
        | typeof USER_FEED_FAILED
        | typeof ZONE_FEED_FAILED
        | typeof CHANNEL_FEED_FAILED
        | typeof POST_DETAIL_FAILED
        | typeof CREATE_VIDEO_FAILED
        | typeof CREATE_POST_LIKE_FAILED
        | typeof REMOVE_POST_LIKE_FAILED;
      payload: ResponseError;
    };

export interface PostDispatch {
  (dispatch: PostActionParams): void;
}

export interface PostAction {
  (dispatch: PostDispatch): void | Promise<void>;
}
