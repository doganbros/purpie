import { Button, ButtonExtendedProps, ThemeContext } from 'grommet';
import { ColorType } from 'grommet/utils';
import React, { FC } from 'react';
import { css } from 'styled-components';
import { theme } from '../../config/app-config';

interface Props extends Omit<ButtonExtendedProps, 'backgroundColor'> {
  fontSize?: string;
  backgroundColor?: ColorType;
  minWidth?: string;
  maxWidth?: string;
}

const ExtendedButtonCSS = css`
  font-size: ${(props: Props) => props.fontSize || '15px'};
  background-color: ${(props: Props) => props.backgroundColor};
  min-width: ${(props: Props) => props.minWidth};
  max-width: ${(props: Props) => props.maxWidth};
  padding: 7px 32px;
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
