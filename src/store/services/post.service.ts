import { serialize } from 'object-to-formdata';
import { nanoid } from 'nanoid';
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

export const createVideo = (data: CreateVideoPayload): Promise<any> =>
  http
    .post('video/create/', serialize(data), {
      headers: {
        'Content-Type': `multipart/form-data; boundary=---WebKitFormBoundary${nanoid()}`,
      },
    })
    .then((res) => res.data);

export const create = (postId: number): Promise<Post> =>
  http.get(`/post/detail/feed/${postId}`).then((res) => res.data);

export const createPostLike = (postId: number): Promise<Post> =>
  http.post('/post/like/create', { postId }).then((res) => res.data);

export const removePostLike = (postId: number): Promise<Post> =>
  http.delete(`/post/like/remove/${postId}`).then((res) => res.data);
