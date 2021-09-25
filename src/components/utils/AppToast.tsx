import { Box, Button, Image, Layer, Stack, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import React, { FC } from 'react';
import OkBadge from '../../assets/toast/ok/badge.svg';
import OkBubbles from '../../assets/toast/ok/bubbles.svg';
import WarnBadge from '../../assets/toast/warn/badge.svg';
import WarnBubbles from '../../assets/toast/warn/bubbles.svg';
import ErrorBadge from '../../assets/toast/error/badge.svg';
import ErrorBubbles from '../../assets/toast/error/bubbles.svg';
import InfoBadge from '../../assets/toast/info/badge.svg';
import InfoBubbles from '../../assets/toast/info/bubbles.svg';

interface Props {
  message?: string;
  status?: 'error' | 'ok' | 'info' | 'warn';
  visible: boolean;
  onClose: () => void;
}

const AppToast: FC<Props> = ({ status = 'ok', message, visible, onClose }) => {
  if (!visible) return null;

  const title = {
    error: 'Error!',
    info: 'Info!',
    warn: 'Warning!',
    ok: 'Successful!',
  }[status];

  const bubbles = {
    error: ErrorBubbles,
    info: InfoBubbles,
    warn: WarnBubbles,
    ok: OkBubbles,
  }[status];

  const badge = {
    error: ErrorBadge,
    info: InfoBadge,
    warn: WarnBadge,
    ok: OkBadge,
  }[status];

  const background = {
    error: 'status-critical',
    warn: 'status-warning',
    info: 'status-info',
    ok: 'status-ok',
  }[status];

  return (
    <Layer
      position="top-right"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      responsive={false}
      plain
    >
      <Stack>
        <Box pad={{ top: '22px' }} round="medium">
          <Stack anchor="bottom-left">
            <Box
              width="450px"
              height={{ min: '87px' }}
              round="medium"
              elevation="medium"
              pad={{ left: '116px', top: 'small', right: 'small' }}
              background={background}
            >
              <Box flex="grow">
                <Box direction="row" justify="between">
                  <Text weight="bold" color="white">
                    {title}
                  </Text>
                  <Button
                    icon={<FormClose color="white" />}
                    onClick={onClose}
                    plain
                  />
                </Box>
                <Box flex="grow" pad={{ bottom: 'small', right: 'small' }}>
                  <Text size="small" color="white">
                    {message}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box
              round={{ corner: 'bottom-left', size: 'medium' }}
              overflow="hidden"
            >
              <Image src={bubbles} />
            </Box>
          </Stack>
        </Box>

        <Box pad={{ left: '32px' }}>
          <Image width="44px" src={badge} />
        </Box>
      </Stack>
    </Layer>
  );
};

export default AppToast;
