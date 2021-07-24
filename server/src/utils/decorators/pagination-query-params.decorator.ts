import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const PaginationQueryParams = () =>
  applyDecorators(
    ApiQuery({
      name: 'limit',
      description: 'The number of zones to get. Defaults to 30',
      type: Number,
      required: false,
    }),
    ApiQuery({
      name: 'skip',
      description: 'The number of zones to skip. Defaults to 0',
      type: Number,
      required: false,
    }),
  );
