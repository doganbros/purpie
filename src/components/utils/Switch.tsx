import { Box, BoxProps, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import ExtendedBox from './ExtendedBox';

interface Props extends BoxProps {
  //   checkboxWidth?: number;
  value?: boolean;
  defaultValue?: boolean;
  label?: string;
  onChange: (value: boolean) => void;
}

const Switch: FC<Props> = ({
  label,
  onChange,
  value,
  defaultValue,
  ...otherProps
}) => {
  const [currentValue, setCurrentValue] = useState(
    value || defaultValue || false
  );

  useEffect(() => {
    if (value !== undefined) setCurrentValue(value);
  }, [value]);

  return (
    <Box justify="between" align="center" direction="row" {...otherProps}>
      {label && (
        <Text size="small" color="dark-6">
          {label}
        </Text>
      )}
      <ExtendedBox
        width="55px"
        height="30px"
        background={currentValue ? 'brand' : 'light-6'}
        position="relative"
        transition="0.3s"
        round
        onClick={() => {
          const nextValue = !currentValue;
          setCurrentValue(nextValue);
          onChange(nextValue);
        }}
        direction="row"
      >
        <ExtendedBox
          round
          direction="row"
          height="60%"
          width="57%"
          justify="start"
          background="white"
          left={currentValue ? '30%' : '10%'}
          transition="0.3s"
          position="absolute"
          top="50%"
          transform="translateY(-50%)"
        >
          <Box />
        </ExtendedBox>
      </ExtendedBox>
    </Box>
  );
};

export default Switch;
