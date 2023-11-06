import React, { FC } from 'react';
import { Box, TextExtendedProps, ThemeContext } from 'grommet';
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
          <Box direction="row" align="center" gap="4px">
            ◉
            <EllipsesOverflowText
              maxWidth={truncateWith || '180px'}
              text={name}
              lineClamp={1}
              {...textProps}
            />
          </Box>
        }
      />
    </ThemeContext.Extend>
  );
};

export default ChannelBadge;
