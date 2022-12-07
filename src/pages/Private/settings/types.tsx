import { ReactNode } from 'react';

export interface SettingFormItem {
  key: string;
  title: string;
  description: string;
  value?: string;
  component: ReactNode;
}

export interface SettingsData {
  id: number;
  key: string;
  label: string;
  url: string;
  items?: SettingFormItem[];
  saveButton?: ReactNode;
  avatarWidget?: ReactNode;
  isEmpty?: boolean;
}

export interface MediumType {
  name: 'user' | 'channel' | 'zone';
  id: number;
}
