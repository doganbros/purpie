import {
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

import * as PostService from '../services/post.service';
import { store } from '../store';
import {
  CreateVideoPayload,
  FeedPayload,
  ListPostCommentRepliesParams,
  ListPostCommentsParams,
  PostAction,
  PostSearchParams,
} from '../types/post.types';

export const removePostAction = (payload: { postId: number }): PostAction => {
  return async (dispatch) => {
    try {
      await PostService.removePost(payload.postId);
      dispatch({
        type: REMOVE_POST_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: REMOVE_POST_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getPublicFeedAction = (payload: FeedPayload): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: PUBLIC_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getPublicFeed(payload);
      dispatch({
        type: PUBLIC_FEED_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: PUBLIC_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getUserFeedAction = (payload: FeedPayload): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: USER_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getUserFeed(payload);
      dispatch({
        type: USER_FEED_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: USER_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getZoneFeedAction = (
  payload: FeedPayload & { zoneId: number }
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: ZONE_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getZoneFeed(payload);
      dispatch({
        type: ZONE_FEED_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: ZONE_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getChannelFeedAction = (
  payload: FeedPayload & { channelId: number }
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CHANNEL_FEED_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getChannelFeed(payload);
      dispatch({
        type: CHANNEL_FEED_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: CHANNEL_FEED_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getPostDetailAction = (postId: number): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: POST_DETAIL_REQUESTED,
      payload: { postId },
    });
    try {
      const payload = await PostService.getPostDetail(postId);
      dispatch({
        type: POST_DETAIL_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: POST_DETAIL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const createVideoAction = (
  payload: CreateVideoPayload,
  onUploadProgress: (progressEvent: ProgressEvent<XMLHttpRequestUpload>) => void
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_VIDEO_REQUESTED,
      payload,
    });
    try {
      await PostService.createVideo(payload, onUploadProgress);
      dispatch({
        type: CREATE_VIDEO_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_VIDEO_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const openCreateVideoLayerAction = (): PostAction => {
  return (dispatch) => {
    dispatch({
      type: OPEN_CREATE_VIDEO_LAYER,
    });
  };
};

export const closeCreateVideoLayerAction = (): PostAction => {
  return (dispatch) => {
    dispatch({
      type: CLOSE_CREATE_VIDEO_LAYER,
    });
  };
};

export const createPostLikeAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_POST_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.createPostLike(payload.postId);
      dispatch({
        type: CREATE_POST_LIKE_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_POST_LIKE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const removePostLikeAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_POST_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.removePostLike(payload.postId);
      dispatch({
        type: REMOVE_POST_LIKE_SUCCESS,
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_POST_LIKE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const createPostSaveAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_POST_SAVE_REQUESTED,
      payload,
    });
    try {
      await PostService.createPostSave(payload.postId);
      dispatch({
        type: CREATE_POST_SAVE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_POST_SAVE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const removePostSaveAction = (payload: {
  postId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_POST_SAVE_REQUESTED,
      payload,
    });
    try {
      await PostService.removePostSave(payload.postId);
      dispatch({
        type: REMOVE_POST_SAVE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_POST_SAVE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getSavedPostAction = (payload: {
  limit?: number;
  skip?: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: SAVED_POSTS_REQUESTED,
      payload,
    });
    try {
      const response = await PostService.getSavedPost(payload);
      dispatch({
        type: SAVED_POSTS_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: SAVED_POSTS_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const searchPostAction = (params: PostSearchParams): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_POST_REQUESTED,
      payload: params,
    });
    try {
      const payload = await PostService.searchPost(params);
      dispatch({
        type: SEARCH_POST_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: SEARCH_POST_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const createPostCommentAction = (
  comment: string,
  postId: number,
  parentId?: number
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_POST_COMMENT_REQUESTED,
      payload: {
        comment,
        postId,
        parentId,
      },
    });
    try {
      const payload = await PostService.createPostComment(
        comment,
        postId,
        parentId
      );
      dispatch({
        type: CREATE_POST_COMMENT_SUCCESS,
        payload: {
          ...payload,
          user: store.getState().auth.user || payload.user,
        },
      });
      listPostCommentsAction({ postId });
    } catch (err: any) {
      dispatch({
        type: CREATE_POST_COMMENT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const updatePostAction = (
  postId: number,
  title: string,
  description: string
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_POST_DETAIL_REQUESTED,
      payload: {
        postId,
        title,
        description,
      },
    });
    try {
      await PostService.updatePostDetail(postId, title, description);
      dispatch({
        type: UPDATE_POST_DETAIL_SUCCESS,
        payload: {
          postId,
          title,
          description,
        },
      });
    } catch (err) {
      dispatch({
        type: UPDATE_POST_DETAIL_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const updatePostCommentAction = (
  comment: string,
  commentId: number,
  parentId?: number
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: UPDATE_POST_COMMENT_REQUESTED,
      payload: {
        comment,
        commentId,
        parentId,
      },
    });
    try {
      await PostService.updatePostComment(comment, commentId);
      dispatch({
        type: UPDATE_POST_COMMENT_SUCCESS,
        payload: {
          comment,
          commentId,
          parentId,
        },
      });
    } catch (err: any) {
      dispatch({
        type: UPDATE_POST_COMMENT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const removePostCommentAction = (
  commentId: number,
  parentId?: number
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_POST_COMMENT_REQUESTED,
      payload: {
        commentId,
        parentId,
      },
    });
    try {
      await PostService.removePostComment(commentId);
      dispatch({
        type: REMOVE_POST_COMMENT_SUCCESS,
        payload: { commentId, parentId },
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_POST_COMMENT_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listPostCommentsAction = (
  params: ListPostCommentsParams
): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_POST_COMMENTS_REQUESTED,
      payload: params,
    });
    try {
      const payload = await PostService.listPostComments(params);
      dispatch({
        type: LIST_POST_COMMENTS_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: LIST_POST_COMMENTS_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const listPostCommentRepliesAction = (
  params: ListPostCommentRepliesParams
): PostAction => {
  return async (dispatch) => {
    const { parentId } = params;
    dispatch({
      type: LIST_POST_COMMENT_REPLIES_REQUESTED,
      payload: params,
    });
    try {
      const payload = await PostService.listPostComments(params);
      dispatch({
        type: LIST_POST_COMMENT_REPLIES_SUCCESS,
        payload: { ...payload, parentId },
      });
    } catch (err: any) {
      dispatch({
        type: LIST_POST_COMMENT_REPLIES_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const createPostCommentLikeAction = (params: {
  postId: number;
  commentId: number;
  parentId?: number;
}): PostAction => {
  return async (dispatch) => {
    const { postId, ...payload } = params;
    dispatch({
      type: CREATE_POST_COMMENT_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.createPostCommentLike({
        postId,
        postCommentId: payload.commentId,
      });
      dispatch({
        type: CREATE_POST_COMMENT_LIKE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: CREATE_POST_COMMENT_LIKE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const removePostCommentLikeAction = (payload: {
  commentId: number;
  parentId?: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_POST_COMMENT_LIKE_REQUESTED,
      payload,
    });
    try {
      await PostService.removePostCommentLike(payload.commentId);
      dispatch({
        type: REMOVE_POST_COMMENT_LIKE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_POST_COMMENT_LIKE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};

export const getFeaturedPostAction = (payload: {
  userId: number;
}): PostAction => {
  return async (dispatch) => {
    dispatch({
      type: GET_FEATURED_POST_REQUESTED,
    });
    try {
      const response = await PostService.getFeaturedPost(payload.userId);
      dispatch({
        type: GET_FEATURED_POST_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: GET_FEATURED_POST_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
