import { useRef } from 'react';

export const useDebouncer = (): ((func: () => void, delay: number) => void) => {
  const timerId = useRef<NodeJS.Timeout | null>(null);

  return (func: () => void, delay: number) => {
    if (timerId.current) clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      func();
      timerId.current = null;
    }, delay);
  };
};
