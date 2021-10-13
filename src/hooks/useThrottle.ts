import { useRef } from 'react';

export const useThrottle = (): ((func: () => void, delay: number) => void) => {
  const enableCall = useRef<boolean>(true);

  return (func: () => void, delay: number) => {
    if (enableCall.current) {
      enableCall.current = false;
      func();
      setTimeout(() => {
        enableCall.current = true;
      }, delay);
    }
  };
};
