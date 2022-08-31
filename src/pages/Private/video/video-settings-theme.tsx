import React, { FC } from 'react';
import { ThemeContext, ThemeType } from 'grommet';
import { theme as globalTheme } from '../../../config/app-config';

const VideoSettingsTheme: FC = ({ children }) => {
  const theme: ThemeType = {
    formField: {
      extend: `
        padding: ${globalTheme.global?.edgeSize?.medium};
        border: solid 1px ${globalTheme.global?.colors?.['status-disabled-light']};
        border-radius: ${globalTheme.global?.edgeSize?.medium};
        gap: 10px;
        &:focus-within {
            border-color: ${globalTheme.global?.colors?.brand};
        }
        label {
            margin: 0;
            font-weight: 500;
            & + div {
              border: none;
            }
          }
          input {
            height: 38px;
            border-radius: 0;
            &:focus {
              box-shadow: none;
            }
          }
          textarea {
            padding: 0;
            border-radius: 0;
            margin-top: 10px;
            resize: none;
            height: 80px;
          }
      `,
    },
  };

  return <ThemeContext.Extend value={theme}>{children}</ThemeContext.Extend>;
};

export default VideoSettingsTheme;
