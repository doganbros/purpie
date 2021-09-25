import React, { FC, useContext } from 'react';
import { ResponsiveContext, ThemeContext, ThemeType } from 'grommet';
import { theme as globalTheme } from '../../config/app-config';

const PlanMeetingTheme: FC = ({ children }) => {
  const size = useContext(ResponsiveContext);
  const theme: ThemeType = {
    formField: {
      border: {
        color: 'brand',
      },
      round: 'small',
    },
    tabs: {
      header: {
        extend: `
          justify-content: ${size === 'small' ? 'center' : 'space-between'};
          margin-bottom: ${globalTheme.global?.edgeSize?.medium};
        `,
      },
    },
  };

  return <ThemeContext.Extend value={theme}>{children}</ThemeContext.Extend>;
};

export default PlanMeetingTheme;
