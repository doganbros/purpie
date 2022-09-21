import React, { FC, ReactNode, useState } from 'react';
import { Box, BoxExtendedProps, Text, TextExtendedProps } from 'grommet';

interface ListButtonProps extends BoxExtendedProps {
  label?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  selected?: boolean;
  textProps?: TextExtendedProps;
}

const ListButton: FC<ListButtonProps> = ({
  label,
  rightIcon,
  leftIcon,
  selected,
  textProps,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const setBackgroundColor = () => {
    if (hover) return 'status-disabled-light';
    if (selected) return 'brand';
    return 'white';
  };
  return (
    <Box
      fill
      background={setBackgroundColor()}
      onMouseEnter={() => {
        setHover(true);
      }}
      onMouseLeave={() => {
        setHover(false);
      }}
      pad="small"
      {...props}
    >
      <Box fill direction="row" align="center" gap="small">
        {leftIcon}
        <Box flex={{ grow: 1 }}>
          <Text
            weight={selected ? 'bold' : 'normal'}
            size="small"
            color={selected && !hover ? 'white' : 'black'}
            {...textProps}
          >
            {label}
          </Text>
        </Box>
        {rightIcon}
      </Box>
    </Box>
  );
};

export default ListButton;
