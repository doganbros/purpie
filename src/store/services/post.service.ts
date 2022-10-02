import { serialize } from 'object-to-formdata';
import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  CreateVideoPayload,
  FeedPayload,
  ListPostCommentsParams,
  Post,
  PostComment,
  PostSearchParams,
  SavedPost,
} from '../types/post.types';

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

export const updatePostDetail = (
  postId: number,
  title: string,
  description: string
): Promise<Post> =>
  http
    .put(`/post/update/${postId}`, { title, description })
    .then((res) => res.data);

export const createVideo = (
  data: CreateVideoPayload,
  onUploadProgress: (progressEvent: ProgressEvent<XMLHttpRequestUpload>) => void
): Promise<any> =>
  http
    .post('video/create/', serialize(data), { onUploadProgress })
    .then((res) => res.data);

export const create = (postId: number): Promise<Post> =>
  http.get(`/post/detail/feed/${postId}`).then((res) => res.data);

export const createPostLike = (postId: number): Promise<Post> =>
  http.post('/post/like/create', { postId }).then((res) => res.data);

export const removePostLike = (postId: number): Promise<Post> =>
  http.delete(`/post/like/remove/${postId}`).then((res) => res.data);

export const removePost = (postId: number): Promise<Post> =>
  http.delete(`/post/remove/${postId}`).then((res) => res.data);

export const createPostSave = (postId: number): Promise<Post> =>
  http.post('/post/saved/create', { postId }).then((res) => res.data);

export const removePostSave = (postId: number): Promise<Post> =>
  http.delete(`/post/saved/remove/${postId}`).then((res) => res.data);

export const getSavedPost = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<SavedPost>> =>
  http.get('/post/saved/list', { params }).then((res) => res.data);

export const searchPost = (
  params: PostSearchParams
): Promise<PaginatedResponse<Post>> =>
  http.get(`/post/list/feed/user`, { params }).then((res) => res.data);

export const postViewStats = (
  postId: number,
  startedFrom: number,
  endedAt: number
): Promise<'Created'> => {
  return http
    .post('/post/video/stats/views', {
      postId,
      startedFrom: Math.ceil(startedFrom),
      endedAt: Math.ceil(endedAt),
    })
    .then((res) => res.data);
};

export const createPostComment = (
  comment: string,
  postId: number,
  parentId?: number
): Promise<PostComment> =>
  http
    .post('/post/comment/create', { comment, postId, parentId })
    .then((res) => res.data);

export const updatePostComment = (
  comment: string,
  commentId: number
): Promise<'OK'> =>
  http
    .put('/post/comment/update', { comment, commentId })
    .then((res) => res.data);

export const removePostComment = (commentId: number): Promise<'OK'> =>
  http.delete(`/post/comment/remove/${commentId}`).then((res) => res.data);

export const listPostComments = ({
  postId,
  parentId,
  limit,
  skip,
}: ListPostCommentsParams & { parentId?: number }): Promise<
  PaginatedResponse<PostComment>
> =>
  http
    .get(`/post/comment/list/${postId}/${parentId || ''}`, {
      params: { limit, skip },
    })
    .then((res) => res.data);

export const createPostCommentLike = (params: {
  postId: number;
  postCommentId: number;
}): Promise<number> =>
  http.post('/post/comment/like/create', params).then((res) => res.data);

export const removePostCommentLike = (commentId: number): Promise<string> =>
  http.delete(`/post/comment/like/remove/${commentId}`).then((res) => res.data);

export const getFeaturedPost = (userId: number): Promise<Post> =>
  http.get(`/post/featured/user/${userId}`).then((res) => res.data);
