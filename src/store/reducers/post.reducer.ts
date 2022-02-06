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
  CREATE_POST_LIKE_SUCCESS,
  REMOVE_POST_LIKE_SUCCESS,
  CREATE_POST_SAVE_SUCCESS,
  CREATE_POST_SAVE_FAILED,
  REMOVE_POST_SAVE_SUCCESS,
  REMOVE_POST_SAVE_FAILED,
  SAVED_POSTS_REQUESTED,
  SAVED_POSTS_SUCCESS,
  SAVED_POSTS_FAILED,
  SEARCH_POST_REQUESTED,
  SEARCH_POST_SUCCESS,
  SEARCH_POST_FAILED,
} from '../constants/post.constants';
import { PostActionParams, PostState } from '../types/post.types';
import { paginationInitialState } from '../../helpers/constants';

const initialState: PostState = {
  feed: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
  postDetail: {
    data: null,
    loading: false,
    error: null,
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
};

const postReducer = (
  state = initialState,
  action: PostActionParams
): PostState => {
  switch (action.type) {
    case PUBLIC_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: true,
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
          loading: false,
          error: null,
        },
      };
    case PUBLIC_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: false,
          error: action.payload,
        },
      };
    case USER_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: true,
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
          loading: false,
          error: null,
        },
      };
    case USER_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: false,
          error: action.payload,
        },
      };
    case ZONE_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: true,
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
          loading: false,
          error: null,
        },
      };
    case ZONE_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: false,
          error: action.payload,
        },
      };
    case CHANNEL_FEED_REQUESTED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: true,
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
          loading: false,
          error: null,
        },
      };
    case CHANNEL_FEED_FAILED:
      return {
        ...state,
        feed: {
          ...state.feed,
          loading: false,
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

      const savedPostIndex = saved.data.findIndex(
        (p) => p.post.id === action.payload.postId
      );

      if (savedPostIndex !== -1) saved.data.splice(savedPostIndex, 1);

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
    default:
      return state;
  }
};

export default postReducer;
