import { Injectable, CanActivate, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class InitialUserGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(): Promise<boolean> {
    const systemUserCount = await this.authService.systemUserCount();

    if (systemUserCount)
      throw new UnauthorizedException(
        'Initial user has been specified already',
        'INITIAL_USER_SPECIFIED',
      );

    return true;
  }
}
