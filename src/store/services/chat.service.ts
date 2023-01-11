import { http } from '../../config/http';
import { PaginatedResponse } from '../../models/paginated-response';
import { ChatMessage } from '../types/chat.types';

export const getChatMessages = (
  medium: string,
  id: string,
  limit = 30,
  lastDate?: Date
): Promise<PaginatedResponse<ChatMessage>> =>
  http
    .get(`/chat/list/messages/${medium}/${id}`, { params: { limit, lastDate } })
    .then((res) => res.data);
