import { Category } from '../../models/utils';
import { User } from './auth.types';
import { ZoneListItem } from './zone.types';

export interface ChannelListItem {
  id: number;
  name: string;
  topic: string;
  description: string;
  public: boolean;
  createdBy?: User;
  category?: Category;
  zone?: ZoneListItem;
}

export interface UserChannelListItem {
  id: number;
  createdOn: Date;
  channel: ChannelListItem;
}

export interface UserChannelDetail extends UserChannelListItem {
  channel: Required<ChannelListItem>;
}
