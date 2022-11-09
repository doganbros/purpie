import {
  ADD_POST_SUCCESS,
  CHANNEL_FEED_FAILED,
  CHANNEL_FEED_REQUESTED,
  CHANNEL_FEED_SUCCESS,
  CLOSE_CREATE_VIDEO_LAYER,
  CREATE_POST_COMMENT_FAILED,
  CREATE_POST_COMMENT_LIKE_FAILED,
  CREATE_POST_COMMENT_LIKE_REQUESTED,
  CREATE_POST_COMMENT_LIKE_SUCCESS,
  CREATE_POST_COMMENT_REQUESTED,
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_POST_LIKE_FAILED,
  CREATE_POST_LIKE_REQUESTED,
  CREATE_POST_LIKE_SUCCESS,
  CREATE_POST_SAVE_FAILED,
  CREATE_POST_SAVE_REQUESTED,
  CREATE_POST_SAVE_SUCCESS,
  CREATE_VIDEO_FAILED,
  CREATE_VIDEO_REQUESTED,
  CREATE_VIDEO_SUCCESS,
  GET_FEATURED_POST_FAILED,
  GET_FEATURED_POST_REQUESTED,
  GET_FEATURED_POST_SUCCESS,
  LIST_POST_COMMENT_REPLIES_FAILED,
  LIST_POST_COMMENT_REPLIES_REQUESTED,
  LIST_POST_COMMENT_REPLIES_SUCCESS,
  LIST_POST_COMMENTS_FAILED,
  LIST_POST_COMMENTS_REQUESTED,
  LIST_POST_COMMENTS_SUCCESS,
  OPEN_CREATE_VIDEO_LAYER,
  POST_DETAIL_FAILED,
  POST_DETAIL_REQUESTED,
  POST_DETAIL_SUCCESS,
  PUBLIC_FEED_FAILED,
  PUBLIC_FEED_REQUESTED,
  PUBLIC_FEED_SUCCESS,
  REMOVE_POST_COMMENT_FAILED,
  REMOVE_POST_COMMENT_LIKE_FAILED,
  REMOVE_POST_COMMENT_LIKE_REQUESTED,
  REMOVE_POST_COMMENT_LIKE_SUCCESS,
  REMOVE_POST_COMMENT_REQUESTED,
  REMOVE_POST_COMMENT_SUCCESS,
  REMOVE_POST_FAILED,
  REMOVE_POST_LIKE_FAILED,
  REMOVE_POST_LIKE_REQUESTED,
  REMOVE_POST_LIKE_SUCCESS,
  REMOVE_POST_REQUESTED,
  REMOVE_POST_SAVE_FAILED,
  REMOVE_POST_SAVE_REQUESTED,
  REMOVE_POST_SAVE_SUCCESS,
  REMOVE_POST_SUCCESS,
  SAVED_POSTS_FAILED,
  SAVED_POSTS_REQUESTED,
  SAVED_POSTS_SUCCESS,
  SEARCH_POST_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  UPDATE_POST_COMMENT_FAILED,
  UPDATE_POST_COMMENT_REQUESTED,
  UPDATE_POST_COMMENT_SUCCESS,
  UPDATE_POST_DETAIL_FAILED,
  UPDATE_POST_DETAIL_REQUESTED,
  UPDATE_POST_DETAIL_SUCCESS,
  USER_FEED_FAILED,
  USER_FEED_REQUESTED,
  USER_FEED_SUCCESS,
  ZONE_FEED_FAILED,
  ZONE_FEED_REQUESTED,
  ZONE_FEED_SUCCESS,
} from '../constants/post.constants';
import { PaginatedResponse } from '../../models/paginated-response';
import { ResponseError } from '../../models/response-error';
import { UserBasic } from './auth.types';
import { ChannelBasic } from './channel.types';
import { LoadingState } from '../../models/utils';

export enum PostType {
  meeting = 'meeting',
  video = 'video',
}

export interface Post {
  channel?: ChannelBasic;
  channelId?: number;
  createdBy: UserBasic;
  createdOn: Date;
  description: string;
  id: number;
  liked: boolean;
  liveStream: boolean;
  public: boolean;
  record: boolean;
  saved: boolean;
  streaming: boolean;
  slug: string;
  startDate?: Date;
  title: string;
  type: PostType;
  userContactExclusive: boolean;
  videoName: string;
  postReaction: {
    likesCount: number;
    commentsCount: number;
    liveStreamViewersCount: number;
    viewsCount: number;
  };
  newlyCreated?: boolean;
}

export interface PostComment {
  id: number;
  comment: string;
  parentId: number | null;
  createdOn: Date;
  updatedOn: Date | null;
  edited: true;
  user: UserBasic;
  publishedInLiveStream: boolean;
  replyCount: number;
  likesCount: number;
  liked: boolean;
}

export interface SavedPost {
  id: number;
  createdOn: Date;
  post: Post;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  channelId?: number;
  public?: boolean;
  userContactExclusive?: boolean;
  videoFile: File;
}

export interface FeedPayload {
  limit?: number;
  skip?: number;
  postType?: PostType;
  streaming?: boolean;
  sortBy?: 'time' | 'popularity';
  sortDirection?: 'ASC' | 'DESC';
  tags?: string;
}

export interface PostSearchOptions {
  following?: boolean;
  streaming?: boolean;
}

export interface PostSearchParams extends PostSearchOptions {
  searchTerm: string;
  limit?: number;
  skip?: number;
}

export interface ListPostCommentsParams {
  limit?: number;
  skip?: number;
  postId: number;
}

export interface ListPostCommentRepliesParams extends ListPostCommentsParams {
  parentId: number;
}

export interface PostCommentState extends PostComment {
  replies?: PaginatedResponse<PostComment> & {
    loading: boolean;
    error: ResponseError | null;
  };
}

export interface PostState {
  feed: PaginatedResponse<Post> & {
    loadingState: LoadingState;
    error: ResponseError | null;
  };
  postDetail: {
    loading: boolean;
    error: ResponseError | null;
    data: Post | null;
    comments: PaginatedResponse<PostCommentState> & {
      loading: boolean;
      error: ResponseError | null;
    };
  };
  createVideo: {
    showCreateVideoLayer: boolean;
    uploading: boolean;
    error: ResponseError | null;
  };
  saved: PaginatedResponse<SavedPost> & {
    loading: boolean;
    error: ResponseError | null;
  };
  search: {
    results: PaginatedResponse<Post>;
    loading: boolean;
    error: ResponseError | null;
  };
  featuredPost: {
    data: Post | null;
    loading: boolean;
    error: ResponseError | null;
  };
}

export type PostActionParams =
  | {
      type: typeof PUBLIC_FEED_REQUESTED | typeof USER_FEED_REQUESTED;
      payload: FeedPayload;
    }
  | {
      type: typeof CHANNEL_FEED_REQUESTED;
      payload: FeedPayload & {
        channelId: number;
      };
    }
  | {
      type: typeof ZONE_FEED_REQUESTED;
      payload: FeedPayload & {
        zoneId: number;
      };
    }
  | {
      type: typeof GET_FEATURED_POST_REQUESTED;
    }
  | {
      type:
        | typeof POST_DETAIL_REQUESTED
        | typeof CREATE_POST_LIKE_REQUESTED
        | typeof REMOVE_POST_LIKE_REQUESTED
        | typeof CREATE_POST_SAVE_REQUESTED
        | typeof REMOVE_POST_SAVE_REQUESTED
        | typeof REMOVE_POST_REQUESTED
        | typeof CREATE_POST_SAVE_SUCCESS
        | typeof REMOVE_POST_SAVE_SUCCESS
        | typeof REMOVE_POST_SUCCESS;
      payload: {
        postId: number;
      };
    }
  | {
      type: typeof CREATE_VIDEO_REQUESTED;
      payload: CreateVideoPayload;
    }
  | {
      type: typeof ADD_POST_SUCCESS;
      payload: Post;
    }
  | {
      type: typeof SAVED_POSTS_REQUESTED;
      payload: {
        limit?: number;
        skip?: number;
      };
    }
  | {
      type: typeof CREATE_POST_COMMENT_REQUESTED;
      payload: {
        comment: string;
        postId: number;
        parentId?: number;
      };
    }
  | {
      type: typeof CREATE_POST_COMMENT_SUCCESS;
      payload: PostComment;
    }
  | {
      type:
        | typeof UPDATE_POST_COMMENT_REQUESTED
        | typeof UPDATE_POST_COMMENT_SUCCESS;
      payload: {
        comment: string;
        commentId: number;
        parentId?: number;
      };
    }
  | {
      type:
        | typeof UPDATE_POST_DETAIL_REQUESTED
        | typeof UPDATE_POST_DETAIL_SUCCESS;
      payload: {
        postId: number;
        title: string;
        description: string;
      };
    }
  | {
      type:
        | typeof REMOVE_POST_COMMENT_REQUESTED
        | typeof REMOVE_POST_COMMENT_SUCCESS
        | typeof CREATE_POST_COMMENT_LIKE_REQUESTED
        | typeof CREATE_POST_COMMENT_LIKE_SUCCESS
        | typeof REMOVE_POST_COMMENT_LIKE_REQUESTED
        | typeof REMOVE_POST_COMMENT_LIKE_SUCCESS;
      payload: {
        commentId: number;
        parentId?: number;
      };
    }
  | {
      type: typeof LIST_POST_COMMENTS_REQUESTED;
      payload: ListPostCommentsParams;
    }
  | {
      type: typeof LIST_POST_COMMENT_REPLIES_REQUESTED;
      payload: ListPostCommentRepliesParams;
    }
  | {
      type: typeof LIST_POST_COMMENTS_SUCCESS;
      payload: PaginatedResponse<PostComment>;
    }
  | {
      type: typeof LIST_POST_COMMENT_REPLIES_SUCCESS;
      payload: PaginatedResponse<PostComment> & { parentId: number };
    }
  | {
      type:
        | typeof PUBLIC_FEED_SUCCESS
        | typeof USER_FEED_SUCCESS
        | typeof CHANNEL_FEED_SUCCESS
        | typeof ZONE_FEED_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
  | { type: typeof SAVED_POSTS_SUCCESS; payload: PaginatedResponse<SavedPost> }
  | {
      type: typeof POST_DETAIL_SUCCESS;
      payload: Post;
    }
  | {
      type: typeof SEARCH_POST_REQUESTED;
      payload: PostSearchParams;
    }
  | {
      type: typeof SEARCH_POST_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
  | {
      type: typeof GET_FEATURED_POST_SUCCESS;
      payload: Post;
    }
  | {
      type: typeof CREATE_VIDEO_SUCCESS;
      payload: Post;
    }
  | {
      type:
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
        | typeof REMOVE_POST_LIKE_FAILED
        | typeof CREATE_POST_SAVE_FAILED
        | typeof REMOVE_POST_SAVE_FAILED
        | typeof SAVED_POSTS_FAILED
        | typeof SEARCH_POST_FAILED
        | typeof CREATE_POST_COMMENT_FAILED
        | typeof UPDATE_POST_COMMENT_FAILED
        | typeof UPDATE_POST_DETAIL_FAILED
        | typeof REMOVE_POST_COMMENT_FAILED
        | typeof LIST_POST_COMMENTS_FAILED
        | typeof CREATE_POST_COMMENT_LIKE_FAILED
        | typeof REMOVE_POST_COMMENT_LIKE_FAILED
        | typeof REMOVE_POST_FAILED
        | typeof GET_FEATURED_POST_FAILED;
      payload: ResponseError;
    }
  | {
      type: typeof LIST_POST_COMMENT_REPLIES_FAILED;
      payload: ResponseError & { parentId: number };
    };

export interface PostDispatch {
  (dispatch: PostActionParams): void;
}

export interface PostAction {
  (dispatch: PostDispatch): void | Promise<void>;
}
