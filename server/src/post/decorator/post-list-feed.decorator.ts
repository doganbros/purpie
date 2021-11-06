import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export const ActivityListDecorator = () =>
  applyDecorators(
    ApiQuery({
      name: 'postType',
      description: 'The post type to return. By default it returns all posts. ',
      enum: ['meeting', 'video'],
      required: false,
    }),
    ApiQuery({
      name: 'streaming',
      type: Boolean,
      description: 'Filter by posts that are currently streaming.',
      required: false,
    }),
  );
