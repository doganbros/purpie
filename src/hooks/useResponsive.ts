import { ResponsiveContext } from 'grommet';
import { useContext } from 'react';

export const useResponsive = (): 'small' | 'medium' | 'large' => {
  const size: 'small' | 'medium' | 'large' = useContext(
    ResponsiveContext as any
  );

  return size;
};
