import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import ExtendedBox from './ExtendedBox';

interface Props {
  children: any;
  label: string;
  margin?: any;
}

const SectionContainer: FC<Props> = ({ children, label, margin }) => {
  return (
    <Box margin={margin}>
      <ExtendedBox
        position="absolute"
        left={`35px`}
        background="white"
        pad={{ horizontal: 'small' }}
        marginTop={'-10px'}
      >
        <Text size="small" color="brand" textAlign={'center'}>
          {label}
        </Text>
      </ExtendedBox>
      <Box
        pad="medium"
        border={{ color: 'brand', size: 'xsmall' }}
        round={'small'}
      >
        {children}
      </Box>
    </Box>
  );
};

export default SectionContainer;
