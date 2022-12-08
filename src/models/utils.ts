export enum SearchScope {
  post = 'post',
  channel = 'channel',
  zone = 'zone',
  profile = 'profile',
}

export interface SearchParams {
  value: string;
  scope: SearchScope;
}

export enum LoadingState {
  pending,
  loading,
  more,
  done,
}

export enum InvitationResponseType {
  ACCEPT = 'accept',
  REJECT = 'reject',
}

export enum InvitationType {
  CHANNEL = 'CHANNEL',
  ZONE = 'ZONE',
  CONTACT = 'CONTACT',
}

export enum NotificationType {
  POST = 'post',
  POST_LIKE = 'post_like',
  POST_COMMENT = 'post_comment',
  POST_COMMENT_LIKE = 'post_comment_like',
  POST_COMMENT_REPLY = 'post_comment_reply',
  POST_COMMENT_MENTION = 'post_comment_mention',
  CONTACT_REQUEST_ACCEPTED = 'contact_request_accepted',
  CONTACT_REQUEST_RECEIVED = 'contact_request_received',
  SYSTEM_NOTIFICATION = 'system_notification',
}
