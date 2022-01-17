export type RolePermission<K> = keyof Omit<
  K,
  | 'roleCode'
  | 'roleName'
  | 'isSystemRole'
  | 'hasId'
  | 'recover'
  | 'reload'
  | 'remove'
  | 'save'
  | 'softRemove'
>;
