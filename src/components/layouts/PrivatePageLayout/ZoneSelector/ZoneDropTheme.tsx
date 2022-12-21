import React, { FC } from 'react';
import { ThemeContext } from 'grommet';

const ZoneDropTheme: FC = ({ children }) => {
  const theme = {
    global: {
      drop: {
        background: 'white',
        extend: `
        & > * > *:hover {
          font-weight: bold;
          background: status-disabled-light;
        };
      `,
      },
    },
  };

  return <ThemeContext.Extend value={theme}>{children}</ThemeContext.Extend>;
};

export default ZoneDropTheme;
