import React, { FC } from 'react';
import { Text, TextExtendedProps, ThemeContext } from 'grommet';
import { AnchorLink } from '../AnchorNavLink';

interface ChannelBadgeProps {
  name?: string;
  url: string;
  textProps?: TextExtendedProps;
}

const ChannelBadge: FC<ChannelBadgeProps> = ({ name, url, textProps }) => {
  return (
    <ThemeContext.Extend
      value={{
        anchor: {
          hover: {
            textDecoration: 'none',
          },
        },
      }}
    >
      <AnchorLink to={url} label={<Text {...textProps}>◉ {name}</Text>} />
    </ThemeContext.Extend>
  );
};

export default ChannelBadge;
