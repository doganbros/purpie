import { paginationInitialState } from '../../helpers/constants';
import { FolderActionParams, FolderState } from '../types/folder.types';
import {
  ADD_FOLDER_ITEM_SUCCESS,
  CREATE_FOLDER_SUCCESS,
  LIST_FOLDER_FAILED,
  LIST_FOLDER_REQUESTED,
  LIST_FOLDER_SUCCESS,
} from '../constants/folder.constants';

const initialState: FolderState = {
  folderList: {
    ...paginationInitialState,
    loading: false,
    error: null,
  },
};

const folderReducer = (
  state = initialState,
  action: FolderActionParams
): FolderState => {
  switch (action.type) {
    case CREATE_FOLDER_SUCCESS:
      return {
        ...state,
        folderList: {
          ...state.folderList,
          data: [action.payload, ...state.folderList.data],
        },
      };
    case LIST_FOLDER_REQUESTED:
      return {
        ...state,
        folderList: {
          ...state.folderList,
          loading: true,
          error: null,
        },
      };
    case LIST_FOLDER_SUCCESS:
      return {
        ...state,
        folderList: {
          ...action.payload,
          loading: false,
          error: null,
        },
      };
    case LIST_FOLDER_FAILED:
      return {
        ...state,
        folderList: {
          ...state.folderList,
          loading: false,
          error: action.payload,
        },
      };
    case ADD_FOLDER_ITEM_SUCCESS: {
      const index = state.folderList.data.findIndex(
        (f) => f.id === action.payload.folderId
      );
      const newFolderList = [...state.folderList.data];
      newFolderList[index].folderItems = [
        ...newFolderList[index].folderItems,
        action.payload,
      ];
      newFolderList[index].itemCount++;

      return {
        ...state,
        folderList: { ...state.folderList, data: newFolderList },
      };
    }

    default:
      return state;
  }
};

export default folderReducer;
