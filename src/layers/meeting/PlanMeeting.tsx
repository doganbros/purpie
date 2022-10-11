import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text, Layer, Grid } from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { isEqual } from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { useTranslation } from 'react-i18next';
import MeetingDetails from './sections/MeetingDetails';
import MeetingPrivacy from './sections/MeetingPrivacy';
import MeetingInvitation from './sections/MeetingInvitation';
import MeetingConfiguration from './sections/MeetingConfiguration';
import { AppState } from '../../store/reducers/root.reducer';
import {
  createMeetingAction,
  getUserMeetingConfigAction,
  planMeetingDialogSetAction,
  setInitialMeetingFormAction,
  setMeetingFormFieldAction,
} from '../../store/actions/meeting.action';
import { CreateMeetingPayload } from '../../store/types/meeting.types';
import { appSubdomain } from '../../helpers/app-subdomain';
import { useResponsive } from '../../hooks/useResponsive';
import PlanMeetingTheme from './custom-theme';
import Switch from '../../components/utils/Switch';

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props {
  visible: boolean;
  onClose: () => void;
  meetingId?: number;
  zoneId?: number;
}

const PlanMeeting: FC<Props> = ({ onClose, visible }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const size = useResponsive();
  const [showPersistance, setShowPersistance] = useState(false);

  const {
    meeting: {
      createMeeting: {
        planDialogCurrentIndex,
        invitedUsers,
        form: { payload: formPayload, submitting },
      },
      userMeetingConfig,
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    if (!userMeetingConfig.config && !userMeetingConfig.loading)
      dispatch(getUserMeetingConfigAction());
  }, []);

  useEffect(() => {
    if (userMeetingConfig.config && !formPayload && visible) {
      const {
        public: publicMeeting,
        userContactExclusive,
        liveStream,
        record,
      } = userMeetingConfig.config.privacyConfig;

      const initialPayload: CreateMeetingPayload = {
        startDate: null,
        config: userMeetingConfig.config.jitsiConfig,
        public: !appSubdomain && publicMeeting,
        userContactExclusive: !appSubdomain && userContactExclusive,
        planForLater: false,
        liveStream,
        record,
        timeZone: dayjs.tz.guess(),
      };

      dispatch(setInitialMeetingFormAction(initialPayload));
    }
  }, [userMeetingConfig.config, visible]);

  useEffect(() => {
    setShowPersistance(false);
  }, [visible]);

  if (!visible) return null;

  const submitMeeting = () => {
    if (formPayload && userMeetingConfig.config) {
      const {
        public: publicMeeting,
        userContactExclusive,
        liveStream,
        record,
      } = userMeetingConfig.config.privacyConfig;

      const configChanged =
        !isEqual(formPayload.config, userMeetingConfig.config.jitsiConfig) ||
        !isEqual(
          {
            public: formPayload.public,
            userContactExclusive: formPayload.userContactExclusive,
            liveStream: formPayload.liveStream,
            record: formPayload.record,
          },
          {
            public: !appSubdomain && publicMeeting,
            userContactExclusive: !appSubdomain && userContactExclusive,
            liveStream,
            record,
          }
        );
      if (!showPersistance && configChanged) {
        setShowPersistance(true);
      } else {
        dispatch(
          createMeetingAction({
            ...formPayload,
            invitationIds: invitedUsers.map((u) => u.id),
          })
        );
      }
    }
  };

  const content = [
    {
      id: 1,
      title: t('PlanMeeting.details'),
      component: <MeetingDetails />,
    },
    {
      id: 2,
      title: t('PlanMeeting.invite'),
      component: <MeetingInvitation />,
    },
    {
      id: 3,
      title: t('PlanMeeting.privacy'),
      component: <MeetingPrivacy />,
    },
    {
      id: 4,
      title: t('PlanMeeting.more'),
      component: <MeetingConfiguration />,
    },
  ];
  return (
    <PlanMeetingTheme>
      <Layer onClickOutside={onClose}>
        <Box
          width={size !== 'small' ? '750px' : undefined}
          height={size !== 'small' ? '505px' : '100vh'}
          round={size !== 'small' ? '20px' : undefined}
          background="white"
          pad="medium"
          gap={size !== 'small' ? 'medium' : 'large'}
          align="stretch"
        >
          <Box
            fill="horizontal"
            direction="row"
            justify="between"
            align="start"
          >
            <Box pad="xsmall">
              <Text size="large" weight="bold">
                {t('PlanMeeting.title')}
              </Text>
            </Box>
            <Button plain onClick={onClose}>
              <Close color="brand" />
            </Button>
          </Box>
          {showPersistance ? (
            <Box flex gap="medium" align="center" justify="center">
              <Box direction="row" gap="large" pad="medium" align="center">
                <Text color="status-disabled" size="small">
                  {t('PlanMeeting.saveConfiguration')}
                </Text>
                <Switch
                  value={formPayload?.saveConfig}
                  onChange={(value) =>
                    dispatch(setMeetingFormFieldAction({ saveConfig: value }))
                  }
                />
              </Box>
            </Box>
          ) : (
            <>
              <Grid
                columns={size === 'small' ? '1/2' : '1/4'}
                gap={{ column: 'medium', row: 'small' }}
                margin={{ bottom: size === 'small' ? 'large' : 'medium' }}
              >
                {content.map((item, i) => (
                  <Button
                    onClick={() => {
                      dispatch(planMeetingDialogSetAction(i));
                    }}
                    key={item.id}
                    plain
                  >
                    <Box
                      align="center"
                      border={{
                        side: 'bottom',
                        size: 'small',
                        color:
                          planDialogCurrentIndex === i
                            ? 'brand'
                            : 'status-disabled',
                      }}
                      pad={{ horizontal: 'xsmall' }}
                    >
                      <Text
                        size="medium"
                        weight="bold"
                        color={
                          planDialogCurrentIndex === i
                            ? 'brand'
                            : 'status-disabled'
                        }
                      >
                        {item.title}
                      </Text>
                    </Box>
                  </Button>
                ))}
              </Grid>
              <Box overflow="auto" fill>
                <Box flex={false}>
                  {formPayload && content[planDialogCurrentIndex]?.component}
                </Box>
              </Box>
            </>
          )}

          <Box direction="row" gap="small" justify="center">
            {showPersistance && (
              <Box
                background="status-disabled"
                round="small"
                justify="center"
                align="center"
                onClick={() => {
                  setShowPersistance(false);
                }}
                width="240px"
                height="46px"
              >
                <Text weight="bold" size="small" color="white">
                  {t('common.back')}
                </Text>
              </Box>
            )}
            <Box
              background="accent-1"
              round="small"
              justify="center"
              align="center"
              onClick={() => {
                if (!submitting) submitMeeting();
              }}
              width="240px"
              height="46px"
              margin={{ bottom: size === 'small' ? 'medium' : 'none' }}
            >
              <Text weight="bold" size="small" color="dark-1">
                {!submitting ? t('common.go') : t('PlanMeeting.createMeeting')}
              </Text>
            </Box>
          </Box>
        </Box>
      </Layer>
    </PlanMeetingTheme>
  );
};

export default PlanMeeting;
