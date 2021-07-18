import { Select, Text, Box } from 'grommet';
import { Down } from 'grommet-icons';
import React, { FC } from 'react';

const Loader: FC = () => {
  const [value, setValue] = React.useState('Zone 1');
  return (
    <Box background="#FFFFFF26" round="xxsmall">
      <Select
        options={['Zone 1', 'Zone 2', 'Zone 3']}
        size="small"
        plain
        icon={<Down size="small" color="white" />}
        valueLabel={
          <Box pad="xxsmall">
            <Text size="small" color="white">
              {value}
            </Text>
          </Box>
        }
        onChange={({ option }) => setValue(option)}
      />
    </Box>
  );
};

export default Loader;
