import { Box, BoxExtendedProps } from 'grommet';
import styled, { keyframes } from 'styled-components';
import { theme } from '../../config/app-config';

interface PulsatingCirclesProps extends BoxExtendedProps {
  delay?: string;
  size?: string;
}

const pulse = keyframes`
0% {
  transform: scale(0);
  opacity: 0;
}
25% {
  transform: scale(0.5);
  opacity: 1;
}
50% {
  transform: scale(1);
  opacity: 0;
}
75% {
  transform: scale(1);
  opacity: 0;
}
100% {
  transform: scale(1);
  opacity: 0;
}
`;

const PulsatingCircle = styled(Box)<PulsatingCirclesProps>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  border: 1.5px solid ${theme.global?.colors?.brand};
  animation: ${pulse} 6s linear ${(props) => props.delay} infinite;
`;

export default PulsatingCircle;
