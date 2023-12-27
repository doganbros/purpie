import { Video, VideoExtendedProps } from 'grommet';
import styled from 'styled-components';

interface StyledVideoProps extends VideoExtendedProps {
  mirrored?: boolean;
}
export const StyledVideo = styled(Video)`
  transform: rotateY(
    ${(props: StyledVideoProps) => (props.mirrored ? 180 : 0)}deg
  );
`;
