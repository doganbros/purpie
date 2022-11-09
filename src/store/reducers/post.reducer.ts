import {
  ADD_POST_SUCCESS,
  CHANNEL_FEED_FAILED,
  CHANNEL_FEED_REQUESTED,
  CHANNEL_FEED_SUCCESS,
  CLOSE_CREATE_VIDEO_LAYER,
  CREATE_POST_COMMENT_LIKE_SUCCESS,
  CREATE_POST_COMMENT_SUCCESS,
  CREATE_POST_LIKE_SUCCESS,
  CREATE_POST_SAVE_FAILED,
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
  REMOVE_POST_COMMENT_LIKE_SUCCESS,
  REMOVE_POST_COMMENT_SUCCESS,
  REMOVE_POST_LIKE_SUCCESS,
  REMOVE_POST_SAVE_FAILED,
  REMOVE_POST_SAVE_SUCCESS,
  SAVED_POSTS_FAILED,
  SAVED_POSTS_REQUESTED,
  SAVED_POSTS_SUCCESS,
  SEARCH_POST_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  UPDATE_POST_COMMENT_SUCCESS,
  UPDATE_POST_DETAIL_SUCCESS,
  USER_FEED_FAILED,
  USER_FEED_REQUESTED,
  USER_FEED_SUCCESS,
  ZONE_FEED_FAILED,
  ZONE_FEED_REQUESTED,
  ZONE_FEED_SUCCESS,
} from '../constants/post.constants';
import { PostActionParams, PostState } from '../types/post.types';
import { paginationInitialState } from '../../helpers/constants';
import { LoadingState } from '../../models/utils';

const initialState: PostState = {
  feed: {
    ...paginationInitialState,
    loadingState: LoadingState.pending,
    error: null,
  },
  postDetail: {
    data: null,
    loading: false,
    error: null,
    comments: {
      loading: false,
      error: null,
      ...paginationInitialState,
    },
  },
  createVideo: {
    showCreateVideoLayer: false,
    uploading: false,
    error: null,
  },
  saved: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  search: {
    results: paginationInitialState,
    loading: false,
    error: null,
  },
  featuredPost: {
    data: null,
    loading: false,
    error: null,
  },
};

const postReducer = (
  state = initialState,
  action: PostActionParams
): PostState => {
  switch (action.type) {
    case ADD_POST_SUCCESS:
      return {
        ...state,
        feed: {
          ...state.feed,
          data: [action.payload, ...state.feed.data],
        },
      };
    case UPDATE_POST_DETAIL_SUCCESS:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          data: state.postDetail.data
            ? {
                ...state.postDetail.data,
                ...action.payload,
              }
            : state.postDetail.data,
        },
      };
      break;
    case PUBLIC_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState:
            (action.payload.skip || 0) > 0
              ? LoadingState.more
              : LoadingState.loading,
          error: null,
        },
      };
    case PUBLIC_FEED_SUCCESS:
      return {
        ...state,
        feed: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.feed.data, ...action.payload.data]
              : action.payload.data,
          loadingState: LoadingState.done,
          error: null,
        },
      };
    case PUBLIC_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState: LoadingState.done,
          error: action.payload,
        },
      };
    case USER_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState:
            (action.payload.skip || 0) > 0
              ? LoadingState.more
              : LoadingState.loading,
          error: null,
        },
      };
    case USER_FEED_SUCCESS:
      return {
        ...state,
        feed: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.feed.data, ...action.payload.data]
              : action.payload.data,
          loadingState: LoadingState.done,
          error: null,
        },
      };
    case USER_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState: LoadingState.done,
          error: action.payload,
        },
      };
    case ZONE_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState:
            (action.payload.skip || 0) > 0
              ? LoadingState.more
              : LoadingState.loading,
          error: null,
        },
      };
    case ZONE_FEED_SUCCESS:
      return {
        ...state,
        feed: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.feed.data, ...action.payload.data]
              : action.payload.data,
          loadingState: LoadingState.done,
          error: null,
        },
      };
    case ZONE_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState: LoadingState.done,
          error: action.payload,
        },
      };
    case CHANNEL_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState:
            (action.payload.skip || 0) > 0
              ? LoadingState.more
              : LoadingState.loading,
          error: null,
        },
      };
    case CHANNEL_FEED_SUCCESS:
      return {
        ...state,
        feed: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.feed.data, ...action.payload.data]
              : action.payload.data,
          loadingState: LoadingState.done,
          error: null,
        },
      };
    case CHANNEL_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loadingState: LoadingState.done,
          error: action.payload,
        },
      };
    case POST_DETAIL_REQUESTED:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          loading: true,
          error: null,
        },
      };
    case POST_DETAIL_SUCCESS:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case POST_DETAIL_FAILED:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          loading: false,
          error: action.payload,
        },
      };
    case CREATE_VIDEO_REQUESTED:
      return {
        ...state,
        createVideo: {
          ...state.createVideo,
          uploading: true,
          error: null,
        },
      };
    case CREATE_VIDEO_SUCCESS:
      return {
        ...state,
        feed: {
          ...state.feed,
          data: [action.payload, ...state.feed.data],
        },
        createVideo: {
          ...state.createVideo,
          uploading: false,
          error: null,
        },
      };
    case CREATE_VIDEO_FAILED:
      return {
        ...state,
        createVideo: {
          ...state.createVideo,
          uploading: false,
          error: action.payload,
        },
      };
    case OPEN_CREATE_VIDEO_LAYER:
      return {
        ...state,
        createVideo: {
          ...state.createVideo,
          showCreateVideoLayer: true,
        },
      };
    case CLOSE_CREATE_VIDEO_LAYER:
      return {
        ...state,
        createVideo: {
          ...state.createVideo,
          showCreateVideoLayer: false,
        },
      };
    case CREATE_POST_LIKE_SUCCESS:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          data: state.postDetail.data
            ? {
                ...state.postDetail.data,
                liked: true,
                postReaction: {
                  ...state.postDetail.data.postReaction,
                  likesCount: state.postDetail.data.postReaction.likesCount + 1,
                },
              }
            : state.postDetail.data,
        },
      };
    case REMOVE_POST_LIKE_SUCCESS:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          data: state.postDetail.data
            ? {
                ...state.postDetail.data,
                liked: false,
                postReaction: {
                  ...state.postDetail.data.postReaction,
                  likesCount: state.postDetail.data.postReaction.likesCount - 1,
                },
              }
            : state.postDetail.data,
        },
      };
    case CREATE_POST_SAVE_SUCCESS: {
      const { postDetail, feed, search } = state;

      if (postDetail.data?.id === action.payload.postId)
        postDetail.data.saved = true;

      const feedPostIndex = feed.data.findIndex(
        (p) => p.id === action.payload.postId
      );

      if (feedPostIndex !== -1) feed.data[feedPostIndex].saved = true;

      const searchPostIndex = search.results.data.findIndex(
        (p) => p.id === action.payload.postId
      );

      if (searchPostIndex !== -1)
        search.results.data[searchPostIndex].saved = true;

      return {
        ...state,
        postDetail,
        feed,
        search,
      };
    }
    case REMOVE_POST_SAVE_SUCCESS: {
      const { postDetail, feed, saved, search } = state;

      if (postDetail.data?.id === action.payload.postId)
        postDetail.data.saved = false;

      const feedPostIndex = feed.data.findIndex(
        (p) => p.id === action.payload.postId
      );

      if (feedPostIndex !== -1) feed.data[feedPostIndex].saved = false;

      const searchPostIndex = search.results.data.findIndex(
        (p) => p.id === action.payload.postId
      );

      if (searchPostIndex !== -1)
        search.results.data[searchPostIndex].saved = false;

      saved.data = saved.data.filter((p) => p.id !== action.payload.postId);

      return {
        ...state,
        postDetail,
        feed,
        saved,
        search,
      };
    }
    case CREATE_POST_SAVE_FAILED:
      return {
        ...state,
        saved: {
          ...state.saved,
          loading: false,
          error: action.payload,
        },
      };
    case REMOVE_POST_SAVE_FAILED:
      return {
        ...state,
        saved: {
          ...state.saved,
          loading: false,
          error: action.payload,
        },
      };
    case SAVED_POSTS_REQUESTED:
      return {
        ...state,
        saved: {
          ...state.saved,
          loading: true,
          error: null,
        },
      };
    case SAVED_POSTS_SUCCESS:
      return {
        ...state,
        saved: {
          ...action.payload,
          data:
            action.payload.skip > 0
              ? [...state.saved.data, ...action.payload.data]
              : action.payload.data,
          loading: false,
          error: null,
        },
      };
    case SAVED_POSTS_FAILED:
      return {
        ...state,
        saved: {
          ...state.saved,
          loading: false,
          error: action.payload,
        },
      };
    case SEARCH_POST_REQUESTED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
          error: null,
        },
      };
    case SEARCH_POST_SUCCESS:
      return {
        ...state,
        search: {
          results:
            action.payload.skip > 0
              ? {
                  ...action.payload,
                  data: [...state.search.results.data, ...action.payload.data],
                }
              : action.payload,
          loading: false,
          error: null,
        },
      };
    case SEARCH_POST_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          error: action.payload,
        },
      };
    case CREATE_POST_COMMENT_SUCCESS: {
      if (action.payload.parentId) {
        const { comments } = state.postDetail;
        const parentIndex = comments.data.findIndex(
          (c) => c.id === action.payload.parentId
        );
        const parentComment = comments.data[parentIndex];
        parentComment.replies = {
          ...(parentComment.replies || {
            ...paginationInitialState,
            loading: false,
            error: null,
          }),
        };
        parentComment.replies.data = [
          action.payload,
          ...parentComment.replies.data,
        ];
        parentComment.replyCount += 1;
        comments.data[parentIndex] = parentComment;
        return {
          ...state,
          postDetail: {
            ...state.postDetail,
            comments,
          },
        };
      }
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments: {
            ...state.postDetail.comments,
            data: [action.payload, ...state.postDetail.comments.data],
          },
        },
      };
    }
    case UPDATE_POST_COMMENT_SUCCESS: {
      const { comments } = state.postDetail;
      if (action.payload.parentId) {
        const parentIndex = comments.data.findIndex(
          (c) => c.id === action.payload.parentId
        );
        const parentComment = comments.data[parentIndex];
        if (parentComment.replies) {
          parentComment.replies.data = parentComment.replies.data.map((c) =>
            c.id === action.payload.commentId
              ? {
                  ...c,
                  edited: true,
                  comment: action.payload.comment,
                  updatedOn: new Date(),
                }
              : c
          );
          comments.data[parentIndex] = parentComment;
        }
      } else {
        comments.data = comments.data.map((c) =>
          c.id === action.payload.commentId
            ? {
                ...c,
                edited: true,
                comment: action.payload.comment,
                updatedOn: new Date(),
              }
            : c
        );
      }
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments: {
            ...state.postDetail.comments,
            data: state.postDetail.comments.data.map((c) =>
              c.id === action.payload.commentId
                ? {
                    ...c,
                    edited: true,
                    comment: action.payload.comment,
                    updatedOn: new Date(),
                  }
                : c
            ),
          },
        },
      };
    }
    case REMOVE_POST_COMMENT_SUCCESS: {
      const { comments } = state.postDetail;
      if (action.payload.parentId) {
        const parentIndex = comments.data.findIndex(
          (c) => c.id === action.payload.parentId
        );
        const parentComment = comments.data[parentIndex];
        if (parentComment.replies) {
          parentComment.replies.data = parentComment.replies.data.filter(
            (c) => c.id !== action.payload.commentId
          );

          parentComment.replyCount -= 1;
          if (parentComment.replyCount === 0) {
            parentComment.replies = undefined;
          }
        }
        comments.data[parentIndex] = parentComment;
      } else {
        comments.data = comments.data.filter(
          (c) => c.id !== action.payload.commentId
        );
      }
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case LIST_POST_COMMENTS_REQUESTED:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments: {
            ...state.postDetail.comments,
            loading: true,
            error: null,
          },
        },
      };
    case LIST_POST_COMMENTS_SUCCESS:
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments: {
            ...action.payload,
            data:
              action.payload.skip > 0
                ? [...state.postDetail.comments.data, ...action.payload.data]
                : action.payload.data,
            loading: false,
            error: null,
          },
        },
      };
    case LIST_POST_COMMENTS_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          error: action.payload,
        },
      };
    case LIST_POST_COMMENT_REPLIES_REQUESTED: {
      const parentIndex = state.postDetail.comments.data.findIndex(
        (c) => c.id === action.payload.parentId
      );
      const { comments } = state.postDetail;
      const parentComment = comments.data[parentIndex];

      parentComment.replies = {
        ...(parentComment.replies || paginationInitialState),
        loading: true,
        error: null,
      };

      comments.data[parentIndex] = parentComment;
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case LIST_POST_COMMENT_REPLIES_SUCCESS: {
      const parentIndex = state.postDetail.comments.data.findIndex(
        (c) => c.id === action.payload.parentId
      );
      const { comments } = state.postDetail;
      const parentComment = comments.data[parentIndex];

      parentComment.replies = {
        ...(parentComment.replies || paginationInitialState),
        ...action.payload,
        data:
          action.payload.skip > 0
            ? [...(parentComment.replies?.data || []), ...action.payload.data]
            : action.payload.data,
        loading: false,
        error: null,
      };
      comments.data[parentIndex] = parentComment;
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case LIST_POST_COMMENT_REPLIES_FAILED: {
      const parentIndex = state.postDetail.comments.data.findIndex(
        (c) => c.id === action.payload.parentId
      );
      const { comments } = state.postDetail;
      const parentComment = comments.data[parentIndex];

      parentComment.replies = {
        ...(parentComment.replies || paginationInitialState),
        loading: false,
        error: action.payload,
      };

      comments.data[parentIndex] = parentComment;
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case CREATE_POST_COMMENT_LIKE_SUCCESS: {
      const { comments } = state.postDetail;
      if (action.payload.parentId) {
        const parentIndex = comments.data.findIndex(
          (c) => c.id === action.payload.parentId
        );
        const parentComment = comments.data[parentIndex];
        if (!parentComment || !parentComment.replies) return state;
        parentComment.replies.data = parentComment.replies.data.map((c) =>
          c.id === action.payload.commentId
            ? { ...c, likesCount: c.likesCount + 1, liked: true }
            : c
        );
        comments.data[parentIndex] = parentComment;
      } else {
        comments.data = comments.data.map((c) =>
          c.id === action.payload.commentId
            ? { ...c, likesCount: c.likesCount + 1, liked: true }
            : c
        );
      }
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case REMOVE_POST_COMMENT_LIKE_SUCCESS: {
      const { comments } = state.postDetail;
      if (action.payload.parentId) {
        const parentIndex = comments.data.findIndex(
          (c) => c.id === action.payload.parentId
        );
        const parentComment = comments.data[parentIndex];
        if (!parentComment || !parentComment.replies) return state;
        parentComment.replies.data = parentComment.replies.data.map((c) =>
          c.id === action.payload.commentId
            ? { ...c, likesCount: c.likesCount - 1, liked: false }
            : c
        );
        comments.data[parentIndex] = parentComment;
      } else {
        comments.data = comments.data.map((c) =>
          c.id === action.payload.commentId
            ? { ...c, likesCount: c.likesCount - 1, liked: false }
            : c
        );
      }
      return {
        ...state,
        postDetail: {
          ...state.postDetail,
          comments,
        },
      };
    }
    case GET_FEATURED_POST_REQUESTED:
      return {
        ...state,
        featuredPost: {
          ...state.featuredPost,
          loading: true,
          error: null,
        },
      };
    case GET_FEATURED_POST_SUCCESS:
      return {
        ...state,
        featuredPost: {
          ...state.featuredPost,
          data: action.payload,
          loading: false,
          error: null,
        },
      };
    case GET_FEATURED_POST_FAILED:
      return {
        ...state,
        featuredPost: {
          ...state.featuredPost,
          loading: false,
          error: action.payload,
        },
      };
    default:
      return state;
  }
};

export default postReducer;
