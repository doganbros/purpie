import { Box, Header } from 'grommet';
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

export const ScrollContainer = styled(Box)`
  &::-webkit-scrollbar {
    width: 7px;
    border-radius: 4px;
    background-color: rgba(255, 231, 227, 0.7);
  }
  &::-webkit-scrollbar-thumb {
    width: 7px;
    border-radius: 4px;
    background-color: ${theme.global?.colors?.brand};
  }
`;

export const DayHeader = styled(Header)`
  position: sticky;
  top: 0;
`;
