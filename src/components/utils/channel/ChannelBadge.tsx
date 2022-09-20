import React, { FC } from 'react';
import { Text, TextExtendedProps } from 'grommet';
import { AnchorLink } from '../AnchorNavLink';

interface ChannelBadgeProps {
  name?: string;
  url: string;
  textProps?: TextExtendedProps;
}

const ChannelBadge: FC<ChannelBadgeProps> = ({ name, url, textProps }) => {
  return <AnchorLink to={url} label={<Text {...textProps}>◉ {name}</Text>} />;
};

export default ChannelBadge;
