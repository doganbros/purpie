import React, { FC } from 'react';
import { Box, Stack, Text } from 'grommet';

interface Props {
  children: any;
  label: string;
}

const SectionContainer: FC<Props> = ({ children, label }) => {
  return (
    <Box>
      <Stack interactiveChild="first" anchor="top-left">
        <Box
          margin={{ top: '9px' }}
          pad="medium"
          border={{ color: 'brand', size: 'xsmall' }}
          round="small"
        >
          {children}
        </Box>
        <Box
          margin={{ left: 'small' }}
          pad={{ horizontal: 'small' }}
          background="white"
        >
          <Text size="small" color="brand" textAlign="center">
            {label}
          </Text>
        </Box>
      </Stack>
    </Box>
  );
};

export default SectionContainer;
