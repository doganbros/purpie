import { http } from '../../config/http';
import { CreateFolderPayload, Folder, FolderItem } from '../types/folder.types';
import { PaginatedResponse } from '../../models/paginated-response';

export const createFolder = (params: CreateFolderPayload): Promise<Folder> =>
  http.post('/post/folder/create', params).then((res) => res.data);

export const listFolders = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<Folder>> =>
  http.get('/post/folder/list', { params }).then((res) => res.data);

export const addFolderItem = (
  folderId: number,
  postId: number
): Promise<FolderItem> =>
  http
    .post('/post/folder/item/create', { folderId, postId })
    .then((res) => res.data);
