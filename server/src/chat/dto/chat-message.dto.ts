export class ChatMessageDto {
  identifier?: string;

  message: string;

  roomName: string;

  attachments?: [{ name: string; originalFileName: string }];

  edited?: boolean;

  createdOn: Date;

  to: number;

  parent?: ChatMessageDto;

  medium: 'direct' | 'channel' | 'post';

  createdBy: {
    id: number;
    displayPhoto?: string;
    fullName?: string;
    userName?: string;
  };
}
