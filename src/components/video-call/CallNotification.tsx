import React, { FC } from 'react';
import { Box, Image, Text } from 'grommet';
import AnswerIcon from '../../assets/video-call/answer.svg';
import RejectIcon from '../../assets/video-call/reject.svg';

interface CallNotificationProps {
  name: string;
  onAccept: () => void;
  onReject: () => void;
}

export const CallNotification: FC<CallNotificationProps> = ({
  name,
  onAccept,
  onReject,
}) => {
  return (
    <Box
      elevation="large"
      round="large"
      pad="medium"
      background="white"
      width="400px"
      direction="row"
      align="center"
    >
      <Box fill>
        <Text weight="normal">{name}</Text>
      </Box>
      <Box direction="row" gap="small">
        <Image src={AnswerIcon} onClick={onAccept} />
        <Image src={RejectIcon} onClick={onReject} />
      </Box>
    </Box>
  );
};
