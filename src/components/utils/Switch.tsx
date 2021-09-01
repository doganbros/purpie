import { Box, BoxProps, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import ExtendedBox from './ExtendedBox';

interface Props extends BoxProps {
  //   checkboxWidth?: number;
  value?: boolean;
  defaultValue?: boolean;
  label?: string;
  disabled?: boolean;
  onChange: (value: boolean) => void;
}

const Switch: FC<Props> = ({
  label,
  onChange,
  value,
  disabled,
  defaultValue,
  ...otherProps
}) => {
  const [currentValue, setCurrentValue] = useState(
    value || defaultValue || false
  );

  useEffect(() => {
    if (value !== undefined) setCurrentValue(value);
  }, [value]);

  const handleChange = () => {
    const nextValue = !currentValue;
    setCurrentValue(nextValue);
    onChange(nextValue);
  };

  return (
    <Box justify="between" align="center" direction="row" {...otherProps}>
      {label && (
        <Text size="small" color="dark-6">
          {label}
        </Text>
      )}
      <ExtendedBox
        width="50px"
        height="32px"
        background={currentValue ? 'brand' : 'light-6'}
        position="relative"
        transition="0.3s"
        round
        onClick={disabled ? undefined : handleChange}
        direction="row"
      >
        <ExtendedBox
          round
          direction="row"
          height="24px"
          width="32px"
          justify="start"
          draggable
          background="white"
          left={currentValue ? '25%' : '10%'}
          transition="0.3s"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        />
      </ExtendedBox>
    </Box>
  );
};

export default Switch;
