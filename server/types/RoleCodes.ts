export const ZoneRoleCodeValues = [
  'SUPER_ADMIN',
  'ADMIN',
  'EDITOR',
  'NORMAL',
] as const;
export const ChannelRoleCodeValues = ZoneRoleCodeValues;
export const UserRoleCodeValues = ['SUPER_ADMIN', 'ADMIN', 'NORMAL'] as const;
export const ClientRoleCodeValues = UserRoleCodeValues;

export type ZoneRoleCode = typeof ZoneRoleCodeValues[number];
export type ChannelRoleCode = typeof ChannelRoleCodeValues[number];
export type UserRoleCode = typeof UserRoleCodeValues[number];
export type ClientRoleCode = typeof ClientRoleCodeValues[number];
