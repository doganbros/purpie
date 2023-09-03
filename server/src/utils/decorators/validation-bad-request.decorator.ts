import { applyDecorators } from '@nestjs/common';
import { ApiBadRequestResponse, ApiProperty } from '@nestjs/swagger';

class ValidationError {
  @ApiProperty({ type: Number, example: 400 })
  statusCode: 'number';

  @ApiProperty()
  message: Array<string>;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export const ValidationBadRequest = () =>
  applyDecorators(
    ApiBadRequestResponse({
      type: ValidationError,
      description:
        'Error thrown when validation error occurs according to requested payload.',
    }),
  );
