import { ReactNode } from 'react';

export interface MenuItem {
  key: string;
  label: string;
  component?: ReactNode;
  componentFunc?: (searchText?: string) => ReactNode;
  tabIndex?: number;
  searchableTexts?: string[];
}

export interface Menu {
  key: string;
  label: string;
  labelNotVisible?: boolean;
  url: string;
  header?: ReactNode;
  action?: ReactNode;
  tabs?: { label: string; index: number }[];
  items?: MenuItem[];
}
