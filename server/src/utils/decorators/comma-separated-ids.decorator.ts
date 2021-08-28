import { registerDecorator, ValidationOptions } from 'class-validator';

export function CommaSeparatedIds(validationOptions?: ValidationOptions) {
  return function (object: Record<string, any>, propertyName: string) {
    registerDecorator({
      name: 'commaSeparatedIds',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return (
            typeof value === 'string' &&
            value
              .split(',')
              .map(Number)
              .every((v) => !Number.isNaN(v))
          );
        },
      },
    });
  };
}
