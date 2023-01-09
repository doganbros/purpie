import * as FolderService from '../services/folder.service';
import { setToastAction } from './util.action';
import {
  CreateFolderPayload,
  Folder,
  FolderAction,
} from '../types/folder.types';
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
import i18n from '../../config/i18n/i18n-config';

export const createFolderAction = (
  folder: CreateFolderPayload
): FolderAction => {
  return async (dispatch) => {
    dispatch({
      type: CREATE_FOLDER_REQUESTED,
    });
    try {
      const payload: Folder = await FolderService.createFolder(folder);
      dispatch({
        type: CREATE_FOLDER_SUCCESS,
        payload,
      });

      setToastAction(
        'ok',
        i18n.t('ToastMessages.newFolderCreated', { folderName: payload.title })
      )(dispatch);
    } catch (err: any) {
      dispatch({
        type: CREATE_FOLDER_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const listFolderAction = (): FolderAction => {
  return async (dispatch) => {
    dispatch({
      type: LIST_FOLDER_REQUESTED,
    });
    try {
      const response = await FolderService.listFolders();
      dispatch({
        type: LIST_FOLDER_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: LIST_FOLDER_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const addFolderItemAction = (
  folderId: string,
  postId: string
): FolderAction => {
  return async (dispatch) => {
    dispatch({
      type: ADD_FOLDER_ITEM_REQUESTED,
    });
    try {
      const response = await FolderService.addFolderItem(folderId, postId);
      dispatch({
        type: ADD_FOLDER_ITEM_SUCCESS,
        payload: response,
      });
    } catch (err: any) {
      dispatch({
        type: ADD_FOLDER_ITEM_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};

export const removeFolderItemAction = (
  folderId: string,
  postId: string
): FolderAction => {
  return async (dispatch) => {
    dispatch({
      type: REMOVE_FOLDER_ITEM_REQUESTED,
    });
    try {
      await FolderService.removeFolderItem(folderId, postId);
      dispatch({
        type: REMOVE_FOLDER_ITEM_SUCCESS,
        payload: { folderId, postId },
      });
    } catch (err: any) {
      dispatch({
        type: REMOVE_FOLDER_ITEM_FAILED,
        payload: err?.response?.data,
      });
    }
  };
};
