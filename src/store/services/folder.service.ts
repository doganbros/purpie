import { http } from '../../config/http';
import { CreateFolderPayload, Folder } from '../types/folder.types';
import { PaginatedResponse } from '../../models/paginated-response';

export const createFolder = (params: CreateFolderPayload): Promise<Folder> =>
  http.post('/post/folder/create', params).then((res) => res.data);

export const listFolders = (params: {
  limit?: number;
  skip?: number;
}): Promise<PaginatedResponse<Folder>> =>
  http.post('/post/folder/list', params).then((res) => res.data);
