import React, { FC } from 'react';
import { Box, Text, CheckBox } from 'grommet';
import { MarginType } from 'grommet/utils';

interface Props {
  title: string;
  width?: string;
  nopad?: boolean;
  value: boolean;
  margin?: MarginType;
  onChange: (value: boolean) => void;
}

const MeetingCheckbox: FC<Props> = ({
  title,
  width,
  nopad,
  value = false,
  margin,
  onChange,
}) => {
  return (
    <Box
      pad={nopad ? { bottom: 'none' } : { bottom: 'xsmall' }}
      direction="row"
      gap="medium"
      margin={margin}
      width={width || '280px'}
      justify="between"
    >
      <Text size="small" color="#8F9BB3">
        {title}
      </Text>
      <CheckBox
        checked={value}
        onChange={(e) => {
          onChange(e.target.checked);
        }}
      />
    </Box>
  );
};

export default MeetingCheckbox;
