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
                likesCount: String(+state.postDetail.data.likesCount + 1),
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
                likesCount: String(+state.postDetail.data.likesCount - 1),
              }
            : state.postDetail.data,
        },
      };

    default:
      return state;
  }
};

export default postReducer;
