import { Box, Grommet, BoxExtendedProps } from 'grommet';
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
  minHeight?: string;
  opacity?: string;
  transition?: string;
  transform?: string;
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
  min-height: ${(props: Props) => props.minWidth};
  opacity: ${(props: Props) => props.opacity};
`;

const ExtendedBox: FC<Props> = (props) => {
  return (
    <Grommet
      theme={{
        ...theme,
        box: {
          extend: ExtendedBoxCSS,
        },
      }}
    >
      <Box {...props} />
    </Grommet>
  );
};

export default ExtendedBox;
