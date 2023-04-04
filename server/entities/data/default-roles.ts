import { ChannelRoleCode, ZoneRoleCode } from '../../types/RoleCodes';

export const defaultZoneRoles = [
  {
    roleCode: 'SUPER_ADMIN',
    roleName: 'Super Admin',
    isSystemRole: true,
    canCreateChannel: true,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: 'ADMIN',
    roleName: 'Admin',
    isSystemRole: true,
    canCreateChannel: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: 'EDITOR',
    roleName: 'Editor',
    isSystemRole: true,
    canCreateChannel: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: 'NORMAL',
    roleName: 'Normal',
    isSystemRole: true,
    canCreateChannel: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
];

export const defaultChannelRoles = [
  {
    roleCode: 'SUPER_ADMIN',
    isSystemRole: true,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: 'ADMIN',
    roleName: 'Admin',
    isSystemRole: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: 'EDITOR',
    roleName: 'Editor',
    isSystemRole: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: 'NORMAL',
    roleName: 'Normal',
    isSystemRole: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
];

export const baseChannelRoles = [
  {
    roleCode: ChannelRoleCode.OWNER,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: ChannelRoleCode.MODERATOR,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: ChannelRoleCode.USER,
    canInvite: true,
    canDelete: false,
    canEdit: false,
    canManageRole: false,
  },
];

export const baseZoneRoles = [
  {
    roleCode: ZoneRoleCode.OWNER,
    canCreateChannel: true,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: ZoneRoleCode.MODERATOR,
    canCreateChannel: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: ZoneRoleCode.USER,
    canCreateChannel: false,
    canInvite: true,
    canDelete: false,
    canEdit: false,
    canManageRole: false,
  },
];
