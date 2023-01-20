import { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  title: string;
  value?: string;
  component: ReactNode;
}

export interface Menu {
  id: number;
  key: string;
  label: string;
  labelNotVisible?: boolean;
  url: string;
  items?: MenuItem[];
  saveButton?: ReactNode;
  avatarWidget?: ReactNode;
  isEmpty?: boolean;
  canDelete?: boolean;
  deleteButton?: ReactNode;
  deletePopup?: ReactNode;
}
