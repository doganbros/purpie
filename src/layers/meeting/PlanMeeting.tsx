import React, { FC, useEffect } from 'react';
import { Box, Button, Text, Layer, Form } from 'grommet';
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
  planMeetingDialogBackAction,
  planMeetingDialogForwardAction,
  setInitialMeetingFormAction,
} from '../../store/actions/meeting.action';
import { CreateMeetingPayload } from '../../store/types/meeting.types';
import { appSubdomain } from '../../helpers/app-subdomain';

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

  const {
    meeting: {
      createMeeting: {
        planDialogCurrentIndex,
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
    if (formPayload) dispatch(createMeetingAction(formPayload));
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
    <Layer onClickOutside={onClose}>
      <Form onSubmit={() => dispatch(planMeetingDialogForwardAction)}>
        <Box
          width="750px"
          height="505px"
          round="20px"
          background="white"
          pad="medium"
          gap="medium"
        >
          <Box direction="row" justify="between" align="start">
            <Box pad="xsmall">
              <Text size="large" weight="bold">
                Plan A Meeting
              </Text>
            </Box>
            <Button plain onClick={onClose}>
              <Close color="brand" />
            </Button>
          </Box>
          <Box direction="row" gap="small" justify="center">
            {content.map((item, i) => (
              <Box key={item.id} gap="small" direction="row" align="center">
                <Text
                  size="small"
                  weight={planDialogCurrentIndex >= i ? 'bold' : 'normal'}
                  color={
                    planDialogCurrentIndex >= i ? 'brand' : 'status-disabled'
                  }
                >
                  {item.title}
                </Text>
                {i + 1 !== content.length && (
                  <Box
                    background={
                      planDialogCurrentIndex > i ? 'brand' : 'status-disabled'
                    }
                    height={planDialogCurrentIndex >= i ? '2px' : '1px'}
                    width="48px"
                  />
                )}
              </Box>
            ))}
          </Box>
          <Box height="275px">
            {formPayload && content[planDialogCurrentIndex]?.component}
          </Box>
          <Box direction="row" gap="small" justify="end">
            {planDialogCurrentIndex !== 0 && (
              <Button
                primary
                size="small"
                label="Back"
                color="status-disabled"
                style={{
                  width: 240,
                  borderRadius: 10,
                  height: 46,
                  fontWeight: 'bold',
                }}
                onClick={() => dispatch(planMeetingDialogBackAction)}
              />
            )}
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
            <Button
              primary
              size="small"
              label="Next"
              type="submit"
              style={{
                width: 240,
                borderRadius: 10,
                height: 46,
                fontWeight: 'bold',
              }}
              disabled={planDialogCurrentIndex === content.length - 1}
            />
          </Box>
        </Box>
      </Form>
    </Layer>
  );
};

export default PlanMeeting;
