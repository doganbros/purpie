import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';

@Catch()
export class GlobalExceptionHandler implements ExceptionFilter {
  public catch(exception: unknown, host: ArgumentsHost) {
    const next = host.switchToHttp().getNext();
    if (next) {
      next(exception);
    } else {
      throw exception;
    }
  }
}
