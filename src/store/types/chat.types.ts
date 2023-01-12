export interface ChatState {
  usersOnline: Array<number>;
}

export interface ChatAttachment {
  name: string;
  originalFileName: string;
}
export interface ChatMessage {
  id?: string;
  identifier: string | number;
  parentIdentifier?: string | null;
  attachments?: Array<ChatAttachment>;
  message: string;
  medium: string;
  edited: boolean;
  deleted: boolean;
  systemMessage: boolean;
  to: string;
  roomName: string;
  parent?: ChatMessage;
  createdOn: Date;
  createdBy: {
    id: string;
    displayPhoto?: string;
    fullName: string;
    userName?: string;
  };
  createdByFullName: string;
  readOn?: Date;
}
