import { Select, Box, Text, Avatar } from 'grommet';
import React, { FC } from 'react';

const ZoneSelector: FC = () => {
  const [value, setValue] = React.useState('Doganbros');

  return (
    <Select
      options={['Doganbros', 'Zone 2', 'Zone 3']}
      plain
      value={value}
      icon={false}
      valueLabel={
        <Box
          align="center"
          justify="around"
          background="brand"
          gap="small"
          pad="small"
          round="medium"
        >
          <Avatar background="light-1" size="medium" />
          <Box align="center">
            <Text weight="bold" size="xsmall" color="white">
              {value}
            </Text>
            <Text size="xsmall">Zone</Text>
          </Box>
        </Box>
      }
      onChange={({ option }) => setValue(option)}
    />
  );
};

export default ZoneSelector;
