import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyJWT } from 'helpers/jwt';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(
    private secret: string,
    private invalidTokenMessage: string,
    private validateToken?: (payload: Record<string, any>) => boolean,
  ) {}

  async transform(token: string) {
    if (!token)
      throw new UnauthorizedException(this.invalidTokenMessage, 'INVALID_JWT');

    try {
      const payload = await verifyJWT(token, this.secret);

      if (this.validateToken && !this.validateToken(payload))
        throw new UnauthorizedException(
          this.invalidTokenMessage,
          'INVALID_JWT',
        );

      return payload;
    } catch (err: any) {
      throw new UnauthorizedException(this.invalidTokenMessage, 'INVALID_JWT');
    }
  }
}
