import { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  component: ReactNode;
  tabIndex?: number;
}

export interface Menu {
  key: string;
  label: string;
  url: string;
  header?: ReactNode;
  action?: ReactNode;
  tabs?: { label: string; index: number }[];
  items?: MenuItem[];
}
