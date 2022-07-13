import styled from 'styled-components';
import { Box, Text } from 'grommet';

export const UserFullName = styled(Text)`
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const LeftShadowBox = styled(Box)`
  box-shadow: ' -2px 0px 3px rgb(255 231 227 / 50%)';
`;

export const RightShadowBox = styled(Box)`
  box-shadow: '2px 0px 3px rgb(255 231 227 / 50%)';
`;
