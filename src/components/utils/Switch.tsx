import { Box, BoxProps, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
import ReactSwitch from 'react-switch';
import { theme } from '../../config/app-config';

interface Props extends BoxProps {
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

  const handleChange = (v: boolean) => {
    setCurrentValue(v);
    onChange(v);
  };

  return (
    <Box justify="between" align="center" direction="row" {...otherProps}>
      {label && (
        <Text size="small" color="dark-6">
          {label}
        </Text>
      )}
      <ReactSwitch
        onChange={handleChange}
        checked={currentValue}
        onColor={theme.global?.colors?.brand?.toString()}
        offColor={theme.global?.colors?.['light-6']?.toString()}
        uncheckedIcon={false}
        checkedIcon={false}
        height={27}
        width={43}
        handleDiameter={20}
      />
    </Box>
  );
};

export default Switch;
