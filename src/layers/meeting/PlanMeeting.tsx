import React, { FC, useEffect } from 'react';
import { Box, Button, Text, Layer, Tabs, Tab } from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import MeetingDetails from './sections/MeetingDetails';
import MeetingPrivacy from './sections/MeetingPrivacy';
import MeetingInvitation from './sections/MeetingInvitation';
import MeetingSetting from './sections/MeetingSetting';
import MeetingMoreSetting from './sections/MeetingMoreSetting';
import { AppState } from '../../store/reducers/root.reducer';
import {
  createMeetingAction,
  getUserMeetingConfigAction,
  planMeetingDialogSetAction,
  setInitialMeetingFormAction,
} from '../../store/actions/meeting.action';
import { CreateMeetingPayload } from '../../store/types/meeting.types';
import { appSubdomain } from '../../helpers/app-subdomain';
import { useResponsive } from '../../hooks/useResponsive';
import PlanMeetingTheme from './custom-theme';

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

  if (!visible) return null;

  const submitMeeting = () => {
    if (formPayload)
      dispatch(
        createMeetingAction({
          ...formPayload,
          invitationIds: invitedUsers.map((u) => u.value),
        })
      );
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
      title: 'More Settings',
      component: <MeetingSetting />,
    },
    {
      id: 5,
      title: 'Even More Settings',
      component: <MeetingMoreSetting />,
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
                  <Box flex={false}>{formPayload && content[i]?.component}</Box>
                </Box>
              </Tab>
            ))}
          </Tabs>

          <Box direction="row" gap="small" justify="center">
            <Button
              primary
              size="small"
              label={!submitting ? 'Go!' : 'Creating Meeting...'}
              color="accent-1"
              style={{
                color: 'brand',
                width: 240,
                borderRadius: 10,
                height: 46,
                fontWeight: 'bold',
              }}
              disabled={submitting}
              onClick={submitMeeting}
            />
          </Box>
        </Box>
      </Layer>
    </PlanMeetingTheme>
  );
};

export default PlanMeeting;
