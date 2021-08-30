export const errorResponseDoc = (
  status: number,
  message: string,
  code: string,
  additionalProperty = {},
) => {
  return {
    type: 'object',
    properties: {
      status: {
        type: 'integer',
        example: status,
      },
      message: {
        type: 'string',
        example: message,
      },
      error: {
        type: 'string',
        example: code,
      },
      ...additionalProperty,
    },
  };
};
