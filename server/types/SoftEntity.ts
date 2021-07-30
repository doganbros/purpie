export type SoftEntity<K> = Omit<
  K,
  'hasId' | 'recover' | 'reload' | 'remove' | 'save' | 'softRemove'
>;
