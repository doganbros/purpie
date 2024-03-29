import { ReactNode } from 'react';

export interface PageItem {
  key: string;
  title: string;
  value?: string;
  component: ReactNode;
}

export interface PageData {
  id: number;
  key: string;
  label: string;
  url: string;
  items?: PageItem[];
  saveButton?: ReactNode;
  avatarWidget?: ReactNode;
  isEmpty?: boolean;
  deleteButton?: ReactNode;
  deletePopup?: ReactNode;
  canDelete?: boolean;
}

export interface MediumType {
  name: 'user' | 'channel' | 'zone';
  id: number;
}

export enum RoleCode {
  OWNER = 'OWNER',
  MODERATOR = 'MODERATOR',
  USER = 'USER',
}

export interface PermissionActions {
  roleCode: RoleCode;
  canCreateChannel?: any;
  canInvite: any;
  canDelete: any;
  canEdit: any;
  canManageRole: any;
}
