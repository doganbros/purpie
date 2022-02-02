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
