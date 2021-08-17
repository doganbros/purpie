import React, { FC } from 'react';
import { Box, Text } from 'grommet';

interface Props {
  children: any;
  label: string;
  margin?: any;
}

const SectionContainer: FC<Props> = ({ children, label, margin }) => {
  return (
    <Box margin={margin}>
      <Text
        size="small"
        color="brand"
        style={{
          position: 'absolute',
          backgroundColor: '#FFF',
          left: 35,
          marginTop: -10,
          paddingInline: 10,
          textAlign: 'center',
        }}
      >
        {label}
      </Text>
      <Box
        pad="medium"
        border={{ color: 'brand', size: 'xsmall' }}
        style={{ borderRadius: 10 }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SectionContainer;
