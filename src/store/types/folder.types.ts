import { ResponseError } from '../../models/response-error';
import {
  CREATE_FOLDER_FAILED,
  CREATE_FOLDER_REQUESTED,
  CREATE_FOLDER_SUCCESS,
  LIST_FOLDER_FAILED,
  LIST_FOLDER_REQUESTED,
  LIST_FOLDER_SUCCESS,
} from '../constants/folder.constants';
import { UtilActionParams } from './util.types';
import { PaginatedResponse } from '../../models/paginated-response';

export interface Folder {
  id: number;
  title: string;
}

export interface CreateFolderPayload {
  title: string;
}

export type FolderActionParams =
  | {
      type: typeof CREATE_FOLDER_REQUESTED | typeof LIST_FOLDER_REQUESTED;
    }
  | {
      type: typeof CREATE_FOLDER_SUCCESS;
      payload: Folder;
    }
  | {
      type: typeof LIST_FOLDER_SUCCESS;
      payload: PaginatedResponse<Folder>;
    }
  | {
      type: typeof CREATE_FOLDER_FAILED | typeof LIST_FOLDER_FAILED;
      payload: ResponseError;
    };

export interface FolderDispatch {
  (dispatch: FolderActionParams | UtilActionParams): void;
}

export interface FolderAction {
  (dispatch: FolderDispatch): Promise<void>;
}
