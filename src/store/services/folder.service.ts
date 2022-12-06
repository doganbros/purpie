import { http } from '../../config/http';
import { CreateFolderPayload, Folder, FolderItem } from '../types/folder.types';

export const createFolder = (params: CreateFolderPayload): Promise<Folder> =>
  http.post('/post/folder/create', params).then((res) => res.data);

export const listFolders = (): Promise<Folder[]> =>
  http.get('/post/folder/list').then((res) => res.data);

export const addFolderItem = (
  folderId: number,
  postId: number
): Promise<FolderItem> =>
  http
    .post('/post/folder/item/create', { folderId, postId })
    .then((res) => res.data);

export const removeFolderItem = (
  folderId: number,
  postId: number
): Promise<void> =>
  http
    .post('/post/folder/item/remove', { folderId, postId })
    .then((res) => res.data);
