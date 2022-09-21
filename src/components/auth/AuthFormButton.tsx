import { Button, ButtonExtendedProps, ThemeContext } from 'grommet';
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
  max-width: ${(props: Props) => props.maxWidth};
`;

const AuthFormButton: FC<Props> = (props) => {
  return (
    <ThemeContext.Extend
      value={{
        button: {
          ...theme.button,
          extend: ExtendedButtonCSS,
        },
      }}
    >
      <Button fill="horizontal" size="large" {...props} />
    </ThemeContext.Extend>
  );
};

export default AuthFormButton;
