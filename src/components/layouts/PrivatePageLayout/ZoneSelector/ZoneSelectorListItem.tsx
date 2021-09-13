import React, { FC, ReactNode, useState } from 'react';
import { Box, Button, Text } from 'grommet';

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
  onClick,
}) => {
  const [hover, setHover] = useState(false);

  const setBackgroundColor = () => {
    if (selected) return 'status-disabled';
    if (hover) return 'brand';
    return 'white';
  };

  return (
    <Button
      onClick={onClick}
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
        pad="small"
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
