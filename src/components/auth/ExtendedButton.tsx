import { Button, ButtonExtendedProps, Grommet } from 'grommet';
import React, { FC } from 'react';
import { css } from 'styled-components';
import { theme } from '../../config/app-config';

interface Props extends ButtonExtendedProps {
  fontSize?: string;
  backgroundColor?: string;
  minWidth?: string;
  maxWidth?: string;
}

const ExtendedButtonCSS = css`
  font-size: ${(props: Props) => props.fontSize || '15px'};
  background-color: ${(props: Props) => props.backgroundColor};
  min-width: ${(props: Props) => props.minWidth};
  min-width: ${(props: Props) => props.maxWidth};
`;

const ExtendedButton: FC<Props> = (props) => {
  return (
    <Grommet
      plain
      theme={{
        button: {
          ...theme.button,
          extend: ExtendedButtonCSS,
        },
      }}
    >
      <Button {...props} fill="horizontal" size="large" />
    </Grommet>
  );
};

export default ExtendedButton;
