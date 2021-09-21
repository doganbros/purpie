import React, { FC } from 'react';
import { ThemeContext, ThemeType } from 'grommet';

const theme: ThemeType = {
  formField: {
    border: {
      color: 'brand',
    },
    round: 'small',
  },
};

const PlanMeetingTheme: FC = ({ children }) => (
  <ThemeContext.Extend value={theme}>{children}</ThemeContext.Extend>
);

export default PlanMeetingTheme;
