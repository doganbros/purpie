import { ResponseError } from '../../models/response-error';
import {
  ADD_FOLDER_ITEM_FAILED,
  ADD_FOLDER_ITEM_REQUESTED,
  ADD_FOLDER_ITEM_SUCCESS,
  CREATE_FOLDER_FAILED,
  CREATE_FOLDER_REQUESTED,
  CREATE_FOLDER_SUCCESS,
  LIST_FOLDER_FAILED,
  LIST_FOLDER_REQUESTED,
  LIST_FOLDER_SUCCESS,
  REMOVE_FOLDER_ITEM_FAILED,
  REMOVE_FOLDER_ITEM_REQUESTED,
  REMOVE_FOLDER_ITEM_SUCCESS,
} from '../constants/folder.constants';
import { UtilActionParams } from './util.types';
import { Post } from './post.types';

export interface Folder {
  createdById: number;
  createdOn: Date;
  id: number;
  itemCount: number;
  folderItems: FolderItem[];
  title: string;
  updatedOn: Date;
}

export interface FolderItem {
  id: number;
  postId: number;
  post: Post;
  folderId: number;
}

export interface CreateFolderPayload {
  title: string;
}

export interface FolderState {
  folderList: {
    data: Folder[];
    loading: boolean;
    error: ResponseError | null;
  };
}

export type FolderActionParams =
  | {
      type:
        | typeof CREATE_FOLDER_REQUESTED
        | typeof LIST_FOLDER_REQUESTED
        | typeof ADD_FOLDER_ITEM_REQUESTED
        | typeof REMOVE_FOLDER_ITEM_REQUESTED;
    }
  | {
      type: typeof CREATE_FOLDER_SUCCESS;
      payload: Folder;
    }
  | {
      type: typeof LIST_FOLDER_SUCCESS;
      payload: Folder[];
    }
  | {
      type: typeof ADD_FOLDER_ITEM_SUCCESS;
      payload: FolderItem;
    }
  | {
      type: typeof REMOVE_FOLDER_ITEM_SUCCESS;
      payload: { postId: number; folderId: number };
    }
  | {
      type:
        | typeof CREATE_FOLDER_FAILED
        | typeof LIST_FOLDER_FAILED
        | typeof ADD_FOLDER_ITEM_FAILED
        | typeof REMOVE_FOLDER_ITEM_FAILED;
      payload: ResponseError;
    };

export interface FolderDispatch {
  (dispatch: FolderActionParams | UtilActionParams): void;
}

export interface FolderAction {
  (dispatch: FolderDispatch): Promise<void>;
}
