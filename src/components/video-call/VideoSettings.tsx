import React, { FC, useState } from 'react';
import { Box, Select } from 'grommet';

interface VideoSettingsProps {
  onDismiss: () => void;
}
export const VideoSettings: FC<VideoSettingsProps> = ({ onDismiss }) => {
  const [value, setValue] = useState('small');
  return (
    <Box
      width="100%"
      height="100%"
      background={{ color: 'dark', opacity: 'weak' }}
      onClick={onDismiss}
    >
      <Box background="white" pad="small" round="medium">
        <Select
          options={['small', 'medium', 'large']}
          value={value}
          onChange={({ option }) => setValue(option)}
        />
      </Box>
    </Box>
  );
};
