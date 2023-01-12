export const recordEntityColumns = [
  {
    name: 'id',
    type: 'uuid',
    isPrimary: true,
    isUnique: true,
    default: 'uuid_generate_v4()',
  },
  {
    name: 'createdOn',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'updatedOn',
    type: 'timestamp',
    isNullable: true,
  },
];
