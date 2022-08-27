import { Box, ResponsiveContext, Text } from 'grommet';
import { AddCircle, Share } from 'grommet-icons';
import React, { FC, useContext } from 'react';
import GradientScroll from '../../components/utils/GradientScroll';

interface Props {
  text: string;
  numberOfVideos: number;
}
const SavedVideo: FC<Props> = ({ text, numberOfVideos }) => {
  const size = useContext(ResponsiveContext);
  const filledArray = new Array(numberOfVideos).fill('hello');

  return (
    <Box direction="column" gap="small">
      <Box direction="row" gap="small">
        <Box direction="column" width={{ min: 'small', max: 'small' }}>
          <Box>
            <Text size="large" weight="bold">
              {text}
            </Text>
            <Text size="small" color="status-disabled">
              {numberOfVideos} Video
            </Text>
          </Box>
        </Box>
        <Box>
          <GradientScroll>
            <Box direction="row" gap="small">
              {filledArray.map((item) => (
                <Box
                  width={size !== 'small' ? '144px' : undefined}
                  height={size !== 'small' ? '100px' : undefined}
                  round={size !== 'small' ? '14px' : undefined}
                  fill={size === 'small'}
                  background="blue"
                  key={item}
                />
              ))}
            </Box>
          </GradientScroll>
        </Box>
      </Box>
      <Box direction="row" justify="between">
        <Box direction="row" gap="small" align="center">
          <AddCircle color="brand" size="medium" />
          <Text color="brand" size="small">
            Add New Video
          </Text>
        </Box>
        <Box direction="row" gap="small" align="center">
          <Share color="brand" size="medium" />
          <Text color="brand" size="small">
            Share Video
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default SavedVideo;
