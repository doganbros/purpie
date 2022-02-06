import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { UserBasic } from '../types/auth.types';
import { ProfileSearchParams } from '../types/user.types';

export const searchUser = (
  params: ProfileSearchParams
): Promise<PaginatedResponse<UserBasic>> =>
  http.get(`/user/search`, { params }).then((res) => res.data);
