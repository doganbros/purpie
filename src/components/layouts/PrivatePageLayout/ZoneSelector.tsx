import { Select, Box, Text } from 'grommet';
import { Down } from 'grommet-icons';
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
          direction="row"
          align="center"
          justify="around"
          background="brand"
          fill
          pad="xsmall"
          margin="xsmall"
          round="xsmall"
        >
          <Text size="xsmall" color="white">
            {value}
          </Text>
          <Down size="small" color="white" />
        </Box>
      }
      onChange={({ option }) => setValue(option)}
    >
      {(option) => {
        return (
          <Box pad="xsmall" background={option === value ? '#E4E9F2' : 'white'}>
            <Text weight={option === value ? 'bold' : 'normal'} size="small">
              {option}
            </Text>
          </Box>
        );
      }}
    </Select>
  );
};

export default ZoneSelector;
