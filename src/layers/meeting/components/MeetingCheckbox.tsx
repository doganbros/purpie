import React, { FC, useState } from 'react';
import { Box, Text, CheckBox } from 'grommet';

interface Props {
  title: string;
  onClick: () => void;
  width?: string;
  nopad?: boolean;
}

const MeetingCheckbox: FC<Props> = ({ title, onClick, width, nopad }) => {
  const [value, setValue] = useState<boolean>(false);

  return (
    <Box
      pad={nopad ? { bottom: 'none' } : { bottom: 'xsmall' }}
      direction="row"
      gap="medium"
      width={width || '280px'}
      justify="between"
    >
      <Text size="small" color="#8F9BB3">
        {title}
      </Text>
      <CheckBox
        checked={value || false}
        onChange={() => {
          onClick();
          setValue(!value);
        }}
      />
    </Box>
  );
};

export default MeetingCheckbox;
