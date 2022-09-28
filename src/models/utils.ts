export interface Category {
  id: number;
  name: string;
  parentCategoryId: number;
}

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
