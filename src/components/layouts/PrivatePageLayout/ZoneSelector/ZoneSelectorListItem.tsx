import React, { FC, ReactNode } from 'react';
import { Box, Text } from 'grommet';
import ListButton from '../../../utils/ListButton';

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
}) => (
  <ListButton selected={selected} onClick={onClick}>
    <Box fill direction="row" align="center" gap="small">
      {leftIcon}
      <Box flex={{ grow: 1 }}>
        <Text
          weight={selected ? 'bold' : 'normal'}
          size="small"
          color={selected ? 'white' : 'black'}
        >
          {label}
        </Text>
      </Box>
      {rightIcon}
    </Box>
  </ListButton>
);

export default ZoneSelectorListItem;
