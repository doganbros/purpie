import React, { FC, useState } from 'react';
import { Box, RadioButton } from 'grommet';

interface Props {
  onClick: (index: number) => void;
  width?: string;
  nopad?: boolean;
  labels: string[];
}

const MeetingRadioButton: FC<Props> = ({ labels, onClick, width, nopad }) => {
  const [value, setValue] = useState<number>(-1);

  return (
    <Box
      pad={nopad ? { bottom: 'none' } : { bottom: 'xsmall' }}
      direction="row"
      gap="medium"
      width={width || '280px'}
      justify="between"
    >
      {labels.map((label, i) => (
        <Box key={label}>
          <RadioButton
            name="prop"
            label={label}
            checked={value === i}
            onChange={() => {
              onClick(i);
              setValue(i);
            }}
          />
        </Box>
      ))}
    </Box>
  );
};

export default MeetingRadioButton;
