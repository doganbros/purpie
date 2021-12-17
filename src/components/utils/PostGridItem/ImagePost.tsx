import { Box, Image } from 'grommet';
import React, { FC } from 'react';
import MeetingBackground from '../../../assets/meeting-bg.png';

export const ImagePost: FC = () => {
  return (
    <Box>
      <Image src={MeetingBackground} />
    </Box>
  );
};
