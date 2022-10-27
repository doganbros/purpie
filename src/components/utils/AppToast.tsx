import { Box, Button, Image, Layer, Stack, Text } from 'grommet';
import { FormClose } from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ErrorBadge from '../../assets/toast/error/badge.svg';
import ErrorBubbles from '../../assets/toast/error/bubbles.svg';
import InfoBadge from '../../assets/toast/info/badge.svg';
import InfoBubbles from '../../assets/toast/info/bubbles.svg';
import OkBadge from '../../assets/toast/ok/badge.svg';
import OkBubbles from '../../assets/toast/ok/bubbles.svg';
import WarnBadge from '../../assets/toast/warn/badge.svg';
import WarnBubbles from '../../assets/toast/warn/bubbles.svg';
import { removeToastAction } from '../../store/actions/util.action';

interface Props {
  id?: string;
  message?: string;
  status?: 'error' | 'ok' | 'info' | 'warn';
  visible: boolean;
}

const AppToast: FC<Props> = ({ status = 'ok', message, visible, id }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const title = t(`AppToast.${status}`);

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

  if (!visible) return null;
  return (
    <Layer
      position="top-right"
      modal={false}
      margin={{ vertical: 'medium', horizontal: 'small' }}
      responsive={false}
      plain
    >
      <Stack interactiveChild="first">
        <Box pad={{ top: '22px' }} round="medium">
          <Stack anchor="bottom-left" interactiveChild="first">
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
                    onClick={() => id && dispatch(removeToastAction(id))}
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
