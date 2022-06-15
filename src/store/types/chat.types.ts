export interface ChatState {
  usersOnline: Array<number>;
}
export interface ChatMessage {
  id?: number;
  identifier: string | number;
  parentIdentifier?: string | null;
  message: string;
  medium: string;
  edited: boolean;
  deleted: boolean;
  systemMessage: boolean;
  to: number;
  roomName: string;
  parent?: ChatMessage;
  createdOn: Date;
  createdBy: {
    id: number;
    displayPhoto?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  };
  createdByFullName: string;
  readOn?: Date;
}
