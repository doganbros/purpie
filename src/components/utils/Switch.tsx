import { Box, BoxProps, CheckBox, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';

interface Props extends BoxProps {
  value?: boolean;
  defaultValue?: boolean;
  label?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (value: boolean) => void;
}

const Switch: FC<Props> = ({
  label,
  onChange,
  value,
  name,
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
    if (onChange) onChange(v);
  };

  return (
    <Box
      as="label"
      justify="between"
      align="center"
      direction="row"
      pad="10px"
      gap={otherProps.width ? 'small' : '0'}
      {...otherProps}
    >
      {label && (
        <Text size="small" color="dark-6">
          {label}
        </Text>
      )}
      <CheckBox
        toggle
        name={name}
        checked={currentValue}
        onChange={({ target: { checked } }) => handleChange(checked)}
      />
    </Box>
  );
};

export default Switch;
