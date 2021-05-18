import { Box, Button, Layer, Text } from 'grommet';
import {
  Icon,
  StatusGood,
  StatusCritical,
  StatusInfo,
  FormClose,
} from 'grommet-icons';
import React, { FC } from 'react';

interface Props {
  message?: string;
  status?: 'error' | 'ok' | 'info';
  visible: boolean;
  onClose: () => void;
}

const AppToast: FC<Props> = ({ status, message, visible, onClose }) => {
  if (!visible) return null;
  const StatusIcon = ((): Icon => {
    switch (status) {
      case 'ok':
        return StatusGood;
      case 'error':
        return StatusCritical;
      default:
        return StatusInfo;
    }
  })();

  return (
    <Layer
      position="top-right"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      responsive={false}
      plain
    >
      <Box
        align="center"
        direction="row"
        gap="small"
        justify="between"
        round="medium"
        elevation="medium"
        pad={{ vertical: 'xsmall', horizontal: 'small' }}
        background={status === 'info' ? 'neutral-3' : `status-${status}`}
      >
        <Box align="center" direction="row" gap="xsmall">
          <StatusIcon />
          <Text>{message}</Text>
        </Box>
        <Button icon={<FormClose />} onClick={onClose} plain />
      </Box>
    </Layer>
  );
};

export default AppToast;
