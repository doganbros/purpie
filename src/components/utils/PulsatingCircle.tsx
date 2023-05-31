import { Box, BoxExtendedProps } from 'grommet';
import styled, { keyframes } from 'styled-components';

interface PulsatingCircleProps extends BoxExtendedProps {
  delay?: string;
  size?: string;
  color?: string;
}

const pulse = keyframes`
0% {
  transform: scale(1);
  opacity: 1;
}
25% {
  transform: scale(1.1);
  opacity: 0.6;
}
50% {
  transform: scale(1.2);
  opacity: 0.2;
}
75% {
  transform: scale(1.25);
  opacity: 0;
}
100% {
  transform: scale(1.5);
  opacity: 0;
}
`;

const PulsatingCircle = styled(Box)<PulsatingCircleProps>`
  position: absolute;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  border-radius: 50%;
  border: 1.5px solid ${(props) => props.color};
  animation: ${pulse} 2.5s linear ${(props) => props.delay} infinite;
`;

export default PulsatingCircle;
