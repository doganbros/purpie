import { Notification } from 'grommet-controls';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ResponseError } from '../../models/response-error';

interface Props {
  error: ResponseError | null;
  size?: 'small' | 'medium' | 'large';
  width?:
    | string
    | {
        width?: string;
        max?: string;
        min?: string;
      };
}

const ErrorNotification: FC<Props> = ({ error, size = 'medium', width }) => {
  const [visible, setVisibility] = useState(false);
  const mounted = useRef<boolean>(false);

  useEffect(() => {
    if (mounted.current) setVisibility(true);
  }, [error]);

  useEffect(() => {
    mounted.current = true;
  }, []);

  if (!error || !visible) return null;
  return (
    <Notification
      status="error"
      width={width}
      height={{ min: '80px' }}
      size={size}
      message={
        typeof error.message === 'string' ? error.message : 'Form Errors'
      }
      onClose={() => setVisibility(false)}
      state={
        Array.isArray(error.message) ? error.message.join(', ') : undefined
      }
    />
  );
};

export default ErrorNotification;
