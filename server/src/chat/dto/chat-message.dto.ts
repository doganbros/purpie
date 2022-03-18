class ParentMessageInfo {
  identifier: string;

  message: string;

  createdOn: string;

  user: {
    id: number;
    displayPhoto?: string;
    firstName?: string;
    lastName?: string;
    userName?: string;
  };
}

export class ChatMessageDto {
  identifier?: string;

  message: string;

  to: number;

  parent?: ParentMessageInfo;

  medium: 'direct' | 'channel' | 'post';
}
