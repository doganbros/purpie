import React, { FC, ReactNode, useState } from 'react';
import { Box, BoxExtendedProps, Text, TextExtendedProps } from 'grommet';

interface ListButtonProps extends BoxExtendedProps {
  label?: string;
  rightIcon?: ReactNode;
  leftIcon?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  textProps?: TextExtendedProps;
}

const ListButton: FC<ListButtonProps> = ({
  label,
  rightIcon,
  leftIcon,
  selected,
  disabled,
  textProps,
  ...props
}) => {
  const [hover, setHover] = useState(false);
  const setBackgroundColor = () => {
    if (hover) return 'status-disabled-light';
    if (selected) return 'brand';
    return 'white';
  };

  const setTextColor = () => {
    if (disabled) return 'status-disabled';
    if (selected && !hover) return 'white';
    return 'black';
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
      flex={{ grow: 1 }}
    >
      <Box fill direction="row" align="center" gap="small">
        {leftIcon}
        <Box flex={{ grow: 1 }}>
          <Text
            weight={selected ? 'bold' : 'normal'}
            size="small"
            color={setTextColor()}
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
