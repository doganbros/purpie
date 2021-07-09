import { SetMetadata } from '@nestjs/common';

export const IsAuthenticated = (...userPermissions: string[]) => {
  return SetMetadata('userPermissions', [
    'isAuthenticated',
    ...userPermissions,
  ]);
};
