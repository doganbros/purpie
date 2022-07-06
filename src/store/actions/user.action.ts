import {
  SEARCH_PROFILE_REQUESTED,
  SEARCH_PROFILE_SUCCESS,
  SEARCH_PROFILE_FAILED,
} from '../constants/user.constants';
import { searchUser } from '../services/user.service';
import { UserAction, ProfileSearchParams } from '../types/user.types';

export const searchProfileAction = (
  params: ProfileSearchParams
): UserAction => {
  return async (dispatch) => {
    dispatch({
      type: SEARCH_PROFILE_REQUESTED,
      payload: params,
    });
    try {
      const payload = await searchUser(params);
      dispatch({
        type: SEARCH_PROFILE_SUCCESS,
        payload,
      });
    } catch (err: any) {
      dispatch({
        type: SEARCH_PROFILE_FAILED,
        payload: err?.reponse?.data,
      });
    }
  };
};
