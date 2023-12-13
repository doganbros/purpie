import React, { FC } from 'react';
import { Box, Image, Text } from 'grommet';
import ActiveCallIcon from '../../assets/video-call/active-call.svg';

interface OutgoingCallProps {
  name: string;
  onEndCall: () => void;
}

export const OutgoingCall: FC<OutgoingCallProps> = ({ onEndCall, name }) => {
  return (
    <Box
      elevation="large"
      round="large"
      pad="medium"
      background="white"
      width="400px"
      gap="medium"
    >
      <Box direction="row" align="center" gap="medium">
        <Box fill direction="row" gap="small">
          <Text weight="normal">{name}</Text>
        </Box>
        <Box onClick={onEndCall}>
          <Image src={ActiveCallIcon} height={30} width={54} />
        </Box>
      </Box>
    </Box>
  );
};
