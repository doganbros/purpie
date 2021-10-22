import {
  VIDEO_DETAIL_REQUESTED,
  VIDEO_DETAIL_SUCCESS,
  VIDEO_DETAIL_FAILED,
} from '../constants/video.constants';
import { VideoActionParams, VideoState } from '../types/video.types';

const initialState: VideoState = {
  loading: false,
  error: null,
  videoDetails: {
    public: true,
    slug: '',
    tags: [],
    userContactExclusive: false,
    videoName: '',
    id: -1,
    description: '',
    createdBy: {
      email: '',
      firstName: '',
      id: -1,
      lastName: '',
    },
  },
};

const videoReducer = (
  state = initialState,
  action: VideoActionParams
): VideoState => {
  switch (action.type) {
    case VIDEO_DETAIL_REQUESTED:
      return {
        ...state,
        loading: true,
      };
    case VIDEO_DETAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        videoDetails: action.payload,
      };
    case VIDEO_DETAIL_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default videoReducer;
