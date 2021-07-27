import {
  Injectable,
  PipeTransform,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyJWT } from 'helpers/jwt';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private secret: string, private invalidTokenMessage: string) {}

  async transform(token: string) {
    if (!token)
      throw new UnauthorizedException(this.invalidTokenMessage, 'INVALID_JWT');

    try {
      const payload = await verifyJWT(token, this.secret);

      return payload;
    } catch (err) {
      throw new UnauthorizedException(this.invalidTokenMessage, 'INVALID_JWT');
    }
  }
}
