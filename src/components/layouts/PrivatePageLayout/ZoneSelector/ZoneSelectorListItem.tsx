import { Box, Button, ResponsiveContext, Text } from 'grommet';
import React, { FC, ReactNode, useContext, useState } from 'react';

interface ZoneSelectorListItemProps {
  label: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
}

const ZoneSelectorListItem: FC<ZoneSelectorListItemProps> = ({
  label,
  rightIcon,
  leftIcon,
  selected,
}) => {
  const [hover, setHover] = useState(false);
  const size = useContext(ResponsiveContext);

  const setBackgroundColor = () => {
    if (selected) return 'status-disabled';
    if (hover) return 'brand';
    return 'white';
  };

  return (
    <Button
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      plain
      fill="horizontal"
    >
      <Box
        fill
        direction="row"
        align="center"
        pad={size === 'small' ? 'small' : 'xsmall'}
        gap="small"
        background={setBackgroundColor()}
      >
        {leftIcon}
        <Box flex={{ grow: 1 }}>
          <Text
            weight={selected ? 'bold' : 'normal'}
            size="small"
            color={hover ? 'white' : 'black'}
          >
            {label}
          </Text>
        </Box>
        {rightIcon}
      </Box>
    </Button>
  );
};

export default ZoneSelectorListItem;
