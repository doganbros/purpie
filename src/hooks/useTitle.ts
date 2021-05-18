import { useEffect } from 'react';

export const useTitle = (title: string, change = true): void => {
  useEffect(() => {
    if (change) document.title = title;
  }, [title, change]);
};
