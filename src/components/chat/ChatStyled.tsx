import { Box } from 'grommet';
import styled from 'styled-components';
import { theme } from '../../config/app-config';

export const MessageBoxContainer = styled(Box)`
  position: sticky;
  bottom: 0;
  z-index: 2;
  background-color: ${theme.global?.colors?.white};
`;

export const DayContainer = styled(Box)`
  position: relative;
`;

export const DayDivider = styled(Box)`
  position: absolute;
  top: 20px;
  z-index: -1;
`;
