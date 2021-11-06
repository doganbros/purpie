import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { CreateVideoPayload, Post, PostType } from '../types/post.types';

export const getPublicFeed = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/post/list/feed/public', {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getUserFeed = (
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/post/list/feed/user', {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getZoneFeed = (
  zoneId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get(`/post/list/feed/zone/${zoneId}`, {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getChannelFeed = (
  channelId: number,
  limit: number,
  skip: number,
  postType?: PostType,
  streaming?: boolean
): Promise<PaginatedResponse<Post>> =>
  http
    .get(`/post/list/feed/channel/${channelId}`, {
      params: { limit, skip, postType, streaming },
    })
    .then((res) => res.data);

export const getPostDetail = (postId: number): Promise<Post> =>
  http.get(`/post/detail/feed/${postId}`).then((res) => res.data);

export const createVideo = (payload: CreateVideoPayload): Promise<any> =>
  http.post('video/create/', { params: payload }).then((res) => res.data);
