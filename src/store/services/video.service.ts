import { http } from '../../config/http';
import { CreateVideoPayload, VideoDetail } from '../types/video.types';

export const createVideo = (video: CreateVideoPayload): Promise<any> =>
  http.post('/video/create', video).then((res) => res.data);

export const getVideoDetail = (videoId: number): Promise<VideoDetail> =>
  http.get(`/video/detail/${videoId}`).then((res) => res.data);
