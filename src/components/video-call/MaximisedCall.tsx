import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { Close } from 'grommet-icons';
import styled from 'styled-components';
import { VideoFrame } from './VideoFrame';

const MaximizedCallContainer = styled.div`
  z-index: 100;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const MaximizedCall: FC = () => {
  return (
    <MaximizedCallContainer>
      <Box
        elevation="large"
        round="small"
        width="470px"
        align="stretch"
        overflow="hidden"
      >
        <Box
          background="brand-alt"
          pad="medium"
          direction="row"
          align="center"
          justify="between"
        >
          <Box
            background={{ color: 'black', opacity: 0.5 }}
            round="xsmall"
            overflow="hidden"
            direction="row"
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              width={{ min: '200px' }}
            >
              <Text>Meeting</Text>
            </Box>
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'small' }}
              background={{ color: 'black', opacity: 0.5 }}
            >
              <Text>5:12</Text>
            </Box>
          </Box>
          <Close color="white" />
        </Box>
        <Box pad="medium" background="white">
          <VideoFrame height="330px" />
        </Box>
      </Box>
    </MaximizedCallContainer>
  );
};
