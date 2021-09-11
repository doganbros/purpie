export const recordEntityColumns = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
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
