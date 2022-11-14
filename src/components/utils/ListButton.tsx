import React, { FC, ReactNode, useState } from 'react';
import { Box, BoxExtendedProps, TextExtendedProps } from 'grommet';
import EllipsesOverflowText from './EllipsesOverflowText';

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
    if (hover || selected) return 'status-disabled-light';
    return 'white';
  };

  const setTextColor = () => {
    if (disabled) return 'status-disabled';
    if (selected && !hover) return 'black';
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
      pad={{ vertical: 'xsmall', horizontal: 'small' }}
      {...props}
    >
      <Box fill direction="row" align="center" justify="between">
        <Box direction="row" align="center" gap="small">
          {leftIcon}

          <EllipsesOverflowText
            maxWidth="195px"
            weight={selected ? 'bold' : 0}
            size="xsmall"
            color={setTextColor()}
            {...textProps}
          >
            {label}
          </EllipsesOverflowText>
        </Box>

        {rightIcon}
      </Box>
    </Box>
  );
};

export default ListButton;
