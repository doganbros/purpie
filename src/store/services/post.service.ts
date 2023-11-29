import { serialize } from 'object-to-formdata';
import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import {
  CreateVideoPayload,
  EditVideoPayload,
  FeedPayload,
  ListPostCommentsParams,
  Post,
  PostComment,
  PostSearchParams,
} from '../types/post.types';

export const getPostFeeds = (
  params: FeedPayload
): Promise<PaginatedResponse<Post>> =>
  http
    .get('/post/feed/list', {
      params,
    })
    .then((res) => res.data);

export const getPostDetail = (postId: string): Promise<Post> =>
  http.get(`/post/feed/detail/${postId}`).then((res) => res.data);

export const updatePostDetail = (payload: EditVideoPayload): Promise<Post> =>
  http.put(`/post/update/${payload.postId}`, payload).then((res) => res.data);

export const createVideo = (
  data: CreateVideoPayload,
  onUploadProgress: (progressEvent: ProgressEvent<XMLHttpRequestUpload>) => void
): Promise<Post> =>
  http
    .post('video/create/', serialize(data), { onUploadProgress })
    .then((res) => res.data);

export const create = (postId: number): Promise<Post> =>
  http.get(`/post/feed/detail/${postId}`).then((res) => res.data);

export const createPostLike = (payload: {
  postId: string;
  type: 'like' | 'dislike';
}): Promise<Post> =>
  http.post('/post/like/create', payload).then((res) => res.data);

export const removePostLike = (postId: string): Promise<Post> =>
  http.delete(`/post/like/remove/${postId}`).then((res) => res.data);

export const removePost = (postId: string): Promise<Post> =>
  http.delete(`/post/remove/${postId}`).then((res) => res.data);

export const searchPost = (
  params: PostSearchParams
): Promise<PaginatedResponse<Post>> =>
  http.get(`/post/feed/list`, { params }).then((res) => res.data);

export const postViewStats = (
  postId: string,
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
  postId: string,
  parentId?: string
): Promise<PostComment> =>
  http
    .post('/post/comment/create', { comment, postId, parentId })
    .then((res) => res.data);

export const updatePostComment = (
  comment: string,
  commentId: string
): Promise<'OK'> =>
  http
    .put('/post/comment/update', { comment, commentId })
    .then((res) => res.data);

export const removePostComment = (commentId: string): Promise<'OK'> =>
  http.delete(`/post/comment/remove/${commentId}`).then((res) => res.data);

export const listPostComments = ({
  postId,
  parentId,
  limit,
  skip,
  sortBy,
}: ListPostCommentsParams & { parentId?: string }): Promise<
  PaginatedResponse<PostComment>
> =>
  http
    .get(`/post/comment/list/${postId}/${parentId || ''}`, {
      params: { limit, skip, sortBy },
    })
    .then((res) => res.data);

export const createPostCommentLike = (params: {
  postId: string;
  postCommentId: string;
}): Promise<number> =>
  http.post('/post/comment/like/create', params).then((res) => res.data);

export const removePostCommentLike = (commentId: string): Promise<string> =>
  http.delete(`/post/comment/like/remove/${commentId}`).then((res) => res.data);

export const getFeaturedPost = (userId: string): Promise<Post> =>
  http.get(`/post/featured/user/${userId}`).then((res) => res.data);
