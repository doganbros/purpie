import { serialize } from 'object-to-formdata';
import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { CreateVideoPayload, FeedPayload, Post } from '../types/post.types';

export const getPublicFeed = (
  params: FeedPayload
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/post/list/feed/public', {
      params,
    })
    .then((res) => res.data);

export const getUserFeed = (
  params: FeedPayload
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/post/list/feed/user', {
      params,
    })
    .then((res) => res.data);

export const getZoneFeed = (
  payload: FeedPayload & { zoneId: number }
): Promise<PaginatedResponse<Post>> => {
  const { zoneId, ...params } = payload;
  return http
    .get(`/post/list/feed/zone/${zoneId}`, {
      params,
    })
    .then((res) => res.data);
};

export const getChannelFeed = (
  payload: FeedPayload & { channelId: number }
): Promise<PaginatedResponse<Post>> => {
  const { channelId, ...params } = payload;
  return http
    .get(`/post/list/feed/channel/${channelId}`, {
      params,
    })
    .then((res) => res.data);
};

export const getPostDetail = (postId: number): Promise<Post> =>
  http.get(`/post/detail/feed/${postId}`).then((res) => res.data);

export const createVideo = (data: CreateVideoPayload): Promise<any> =>
  http.post('video/create/', serialize(data)).then((res) => res.data);

export const create = (postId: number): Promise<Post> =>
  http.get(`/post/detail/feed/${postId}`).then((res) => res.data);

export const createPostLike = (postId: number): Promise<Post> =>
  http.post('/post/like/create', { postId }).then((res) => res.data);

export const removePostLike = (postId: number): Promise<Post> =>
  http.delete(`/post/like/remove/${postId}`).then((res) => res.data);
