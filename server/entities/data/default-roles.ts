import { ChannelRole, ZoneRole } from '../../types/RoleCodes';

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
    roleCode: ChannelRole.OWNER,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: ChannelRole.MODERATOR,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: ChannelRole.USER,
    canInvite: true,
    canDelete: false,
    canEdit: false,
    canManageRole: false,
  },
];

export const baseZoneRoles = [
  {
    roleCode: ZoneRole.OWNER,
    canCreateChannel: true,
    canInvite: true,
    canDelete: true,
    canEdit: true,
    canManageRole: true,
  },
  {
    roleCode: ZoneRole.MODERATOR,
    canCreateChannel: true,
    canInvite: true,
    canDelete: false,
    canEdit: true,
    canManageRole: false,
  },
  {
    roleCode: ZoneRole.USER,
    canCreateChannel: false,
    canInvite: true,
    canDelete: false,
    canEdit: false,
    canManageRole: false,
  },
];
