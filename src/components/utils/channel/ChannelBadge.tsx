import React, { FC } from 'react';
import { TextExtendedProps, ThemeContext } from 'grommet';
import { AnchorLink } from '../AnchorNavLink';
import EllipsesOverflowText from '../EllipsesOverflowText';

interface ChannelBadgeProps {
  name?: string;
  url: string;
  textProps?: TextExtendedProps;
  truncateWith?: string;
}

const ChannelBadge: FC<ChannelBadgeProps> = ({
  name,
  url,
  textProps,
  truncateWith,
}) => {
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
      <AnchorLink
        to={url}
        label={
          <EllipsesOverflowText
            maxWidth={truncateWith || '180px'}
            text={`◉ ${name}`}
            lineClamp={1}
            {...textProps}
          />
        }
      />
    </ThemeContext.Extend>
  );
};

export default ChannelBadge;
