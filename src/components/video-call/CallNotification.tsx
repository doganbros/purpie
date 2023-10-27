import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { AnswerIcon } from './AnswerIcon';
import { RejectIcon } from './RejectIcon';

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
        <AnswerIcon onClick={onAccept} />
        <RejectIcon onClick={onReject} />
      </Box>
    </Box>
  );
};
