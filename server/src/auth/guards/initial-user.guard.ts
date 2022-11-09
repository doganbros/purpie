import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { ErrorTypes } from '../../../types/ErrorTypes';

@Injectable()
export class InitialUserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const systemUserCount = await this.authService.systemUserCount();

    if (systemUserCount)
      throw new UnauthorizedException(
        ErrorTypes.INITIAL_USER_SPECIFIED,
        'Initial user has been specified already',
      );

    return true;
  }
}
