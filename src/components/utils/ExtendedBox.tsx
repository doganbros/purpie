import { Box, BoxExtendedProps, Grommet } from 'grommet';
import React, { FC } from 'react';
import { css } from 'styled-components';
import { theme } from '../../config/app-config';

interface Props extends BoxExtendedProps {
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  minWidth?: string;
  maxWidth?: string;
  minHeight?: string;
  maxHeight?: string;
  opacity?: string;
  transition?: string;
  transform?: string;
  userSelect?: string;
  boxShadow?: string;
  innerRef?: React.LegacyRef<HTMLDivElement>;
}

const ExtendedBoxCSS = css`
  position: ${(props: Props) => props.position};
  transition: ${(props: Props) => props.transition};
  transform: ${(props: Props) => props.transform};
  top: ${(props: Props) => props.top};
  left: ${(props: Props) => props.left};
  right: ${(props: Props) => props.right};
  bottom: ${(props: Props) => props.bottom};
  min-width: ${(props: Props) => props.minWidth};
  max-width: ${(props: Props) => props.maxWidth};
  min-height: ${(props: Props) => props.minHeight};
  max-height: ${(props: Props) => props.maxHeight};
  opacity: ${(props: Props) => props.opacity};
  box-shadow: ${(props: Props) => props.boxShadow};
  user-select: ${(props: Props) => props.userSelect};
`;

const ExtendedBox: FC<Props> = ({ innerRef, ...props }) => {
  return (
    <Grommet
      theme={{
        ...theme,
        box: {
          extend: ExtendedBoxCSS,
        },
      }}
    >
      <Box ref={innerRef} {...props} />
    </Grommet>
  );
};

export default ExtendedBox;
