import React, { FC } from 'react';
import { ThemeContext } from 'grommet';

const ZoneDropTheme: FC = ({ children }) => {
  const theme = {
    global: {
      drop: {
        background: 'white',
      },
    },
  };

  return <ThemeContext.Extend value={theme}>{children}</ThemeContext.Extend>;
};

export default ZoneDropTheme;
