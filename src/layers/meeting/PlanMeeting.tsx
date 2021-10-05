import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text, Layer, Tabs, Tab } from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
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
      const initialPayload: CreateMeetingPayload = {
        startDate: null,
        config: userMeetingConfig.config,
        public: false,
        userContactExclusive: !appSubdomain,
        planForLater: false,
        liveStream: false,
        record: false,
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
    if (formPayload) {
      const configChanged = !_.isEqual(
        formPayload.config,
        userMeetingConfig.config
      );
      if (!showPersistance && configChanged) {
        setShowPersistance(true);
      } else {
        dispatch(
          createMeetingAction({
            ...formPayload,
            invitationIds: invitedUsers.map((u) => u.value),
          })
        );
      }
    }
  };

  const content = [
    {
      id: 1,
      title: 'Meeting Details',
      component: <MeetingDetails />,
    },
    {
      id: 2,
      title: 'Privacy',
      component: <MeetingPrivacy />,
    },
    {
      id: 3,
      title: 'Invite',
      component: <MeetingInvitation />,
    },
    {
      id: 4,
      title: 'Configuration',
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
                Plan A Meeting
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
                  Save meeting configuration?
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
            <Tabs
              flex
              activeIndex={planDialogCurrentIndex}
              onActive={(i) => {
                dispatch(planMeetingDialogSetAction(i));
              }}
            >
              {content.map((item, i) => (
                <Tab
                  key={item.id}
                  plain
                  title={
                    <Box
                      border={{
                        side: 'bottom',
                        size: 'small',
                        color:
                          planDialogCurrentIndex === i
                            ? 'brand'
                            : 'status-disabled',
                      }}
                      pad={{ horizontal: 'xsmall' }}
                      margin={{
                        bottom: size === 'small' ? 'medium' : 'none',
                        horizontal: size === 'small' ? 'medium' : 'none',
                      }}
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
                  }
                >
                  <Box overflow="auto" fill>
                    <Box flex={false}>
                      {formPayload && content[i]?.component}
                    </Box>
                  </Box>
                </Tab>
              ))}
            </Tabs>
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
                  Back
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
            >
              <Text weight="bold" size="small" color="white">
                {!submitting ? 'Go!' : 'Creating Meeting...'}
              </Text>
            </Box>
          </Box>
        </Box>
      </Layer>
    </PlanMeetingTheme>
  );
};

export default PlanMeeting;
