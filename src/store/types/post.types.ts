import {
  ADD_POST_SUCCESS,
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
  CREATE_VIDEO_FAILED,
  CREATE_VIDEO_REQUESTED,
  CREATE_VIDEO_SUCCESS,
  FEED_FAILED,
  FEED_REQUESTED,
  FEED_SUCCESS,
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
  REMOVE_POST_SUCCESS,
  SEARCH_POST_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  UPDATE_POST_COMMENT_FAILED,
  UPDATE_POST_COMMENT_REQUESTED,
  UPDATE_POST_COMMENT_SUCCESS,
  UPDATE_POST_DETAIL_FAILED,
  UPDATE_POST_DETAIL_REQUESTED,
  UPDATE_POST_DETAIL_SUCCESS,
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
  channelId?: string;
  createdBy: UserBasic;
  createdOn: Date;
  description: string;
  id: string;
  liked: boolean;
  disliked: boolean;
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
  allowDislike?: boolean;
}

export interface PostComment {
  id: string;
  comment: string;
  parentId: string | null;
  createdOn: Date;
  updatedOn: Date | null;
  edited: true;
  user: UserBasic;
  publishedInLiveStream: boolean;
  replyCount: number;
  likesCount: number;
  liked: boolean;
}

export interface CreateVideoPayload {
  title: string;
  description?: string;
  channelId?: string;
  public?: boolean;
  userContactExclusive?: boolean;
  videoFile: File;
}

export interface EditVideoPayload {
  postId: string;
  title: string;
  description?: string;
  public?: boolean;
  userContactExclusive?: boolean;
}

export interface FeedPayload {
  limit?: number;
  skip?: number;
  postType?: PostType;
  streaming?: boolean;
  following?: boolean;
  sortBy?: 'time' | 'popularity';
  sortDirection?: 'ASC' | 'DESC';
  tags?: string;
  public?: boolean;
  userId?: string;
  zoneId?: string;
  channelId?: string;
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
  postId: string;
  sortBy?: string;
}

export interface ListPostCommentRepliesParams extends ListPostCommentsParams {
  parentId: string;
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
      type: typeof FEED_REQUESTED;
      payload: FeedPayload;
    }
  | {
      type: typeof GET_FEATURED_POST_REQUESTED;
    }
  | {
      type:
        | typeof POST_DETAIL_REQUESTED
        | typeof REMOVE_POST_REQUESTED
        | typeof REMOVE_POST_SUCCESS
        | typeof REMOVE_POST_LIKE_REQUESTED;
      payload: {
        postId: string;
      };
    }
  | {
      type: typeof CREATE_POST_LIKE_REQUESTED | typeof CREATE_POST_LIKE_SUCCESS;
      payload: {
        postId: string;
        type: 'like' | 'dislike';
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
      type: typeof CREATE_POST_COMMENT_REQUESTED;
      payload: {
        comment: string;
        postId: string;
        parentId?: string;
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
        commentId: string;
        parentId?: string;
      };
    }
  | {
      type:
        | typeof UPDATE_POST_DETAIL_REQUESTED
        | typeof UPDATE_POST_DETAIL_SUCCESS;
      payload: EditVideoPayload;
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
        commentId: string;
        parentId?: string;
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
      payload: PaginatedResponse<PostComment> & { parentId: string };
    }
  | {
      type: typeof FEED_SUCCESS;
      payload: PaginatedResponse<Post>;
    }
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
        | typeof REMOVE_POST_LIKE_SUCCESS;
    }
  | {
      type:
        | typeof FEED_FAILED
        | typeof POST_DETAIL_FAILED
        | typeof CREATE_VIDEO_FAILED
        | typeof CREATE_POST_LIKE_FAILED
        | typeof REMOVE_POST_LIKE_FAILED
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
      payload: ResponseError & { parentId: string };
    };

export interface PostDispatch {
  (dispatch: PostActionParams): void;
}

export interface PostAction {
  (dispatch: PostDispatch): void | Promise<void>;
}
