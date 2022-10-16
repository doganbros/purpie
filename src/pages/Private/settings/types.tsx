import { ReactNode } from 'react';

export interface SettingFormItem {
  key: string;
  title: string;
  description: string;
  value?: string;
  component?: ReactNode;
}

export interface SettingItem {
  key: string;
  title: string;
  items: SettingFormItem[];
}

export interface SettingsData {
  id: number;
  key: string;
  label: string;
  url: string;
  items: SettingItem[];
  onSave: () => void;
}

export interface PersonalSettingsData extends SettingsData {
  role: string;
}

export interface ChannelSettingsData extends SettingsData {
  members: string;
  whichZone: string;
}

export interface ZoneSettingsData extends SettingsData {
  name: string;
  members: string;
}

export interface UserInfo {
  userName: string;
  fullName: string;
}

export interface MediumType {
  name: 'user' | 'channel' | 'zone';
  id: number;
}
