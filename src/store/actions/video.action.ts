import {
  VIDEO_CREATE_REQUESTED,
  VIDEO_CREATE_SUCCESS,
  VIDEO_CREATE_FAILED,
  VIDEO_DETAIL_REQUESTED,
  VIDEO_DETAIL_SUCCESS,
  VIDEO_DETAIL_FAILED,
} from '../constants/video.constants';
import { createVideo, getVideoDetail } from '../services/video.service';
import { CreateVideoPayload, VideoAction } from '../types/video.types';

export const createVideoAction = (video: CreateVideoPayload): VideoAction => {
  return async (dispatch) => {
    dispatch({
      type: VIDEO_CREATE_REQUESTED,
      payload: video,
    });
    try {
      await createVideo(video);
      dispatch({
        type: VIDEO_CREATE_SUCCESS,
      });
    } catch (err) {
      dispatch({
        type: VIDEO_CREATE_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const getVideoDetailAction = (videoId: number): VideoAction => {
  return async (dispatch) => {
    dispatch({
      type: VIDEO_DETAIL_REQUESTED,
      payload: { videoId },
    });
    try {
      const payload = await getVideoDetail(videoId);
      dispatch({
        type: VIDEO_DETAIL_SUCCESS,
        payload,
      });
    } catch (err) {
      dispatch({
        type: VIDEO_DETAIL_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
