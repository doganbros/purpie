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
} from '../constants/post.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import { ChannelBasic } from './channel.types';

export enum PostType {
  meeting = 'meeting',
  video = 'video',
}
export interface Tag {
  id: number;
  value: string;
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
  tags: Tag[];
  title: string;
  type: PostType;
  userContactExclusive: boolean;
  videoName: string;
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
      type: typeof POST_DETAIL_REQUESTED;
      payload: {
        postId: number;
      };
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
        | typeof PUBLIC_FEED_FAILED
        | typeof USER_FEED_FAILED
        | typeof ZONE_FEED_FAILED
        | typeof CHANNEL_FEED_FAILED
        | typeof POST_DETAIL_FAILED;
      payload: ResponseError;
    };

export interface PostDispatch {
  (dispatch: PostActionParams): void;
}

export interface PostAction {
  (dispatch: PostDispatch): Promise<void>;
}
