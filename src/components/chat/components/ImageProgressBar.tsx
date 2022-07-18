import React, { FC } from 'react';
import { Box } from 'grommet';
import {
  UploadingProgressBarContainer,
  UploadingProgressBar,
} from './ChatComponentsStyle';

const ImageProgressBar: FC = () => {
  return (
    <UploadingProgressBarContainer>
      <Box width="80%" height="8px" background="white" round="small">
        <Box direction="row">
          <UploadingProgressBar background="brand" height="8px" round="small" />
        </Box>
      </Box>
    </UploadingProgressBarContainer>
  );
};

export default ImageProgressBar;
