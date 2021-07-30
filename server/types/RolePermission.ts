export type RolePermission<K> = keyof Omit<
  K,
  | 'roleCode'
  | 'roleName'
  | 'hasId'
  | 'recover'
  | 'reload'
  | 'remove'
  | 'save'
  | 'softRemove'
>;
