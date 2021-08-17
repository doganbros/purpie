import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text, Layer } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from 'grommet-icons';
import { getMeetingByIdAction } from '../../store/actions/meeting.action';
import { getMultipleUserZonesAction } from '../../store/actions/zone.action';
import { AppState } from '../../store/reducers/root.reducer';
import MeetingDetails from './sections/MeetingDetails';
import MeetingPrivacy from './sections/MeetingPrivacy';
import MeetingInvitation from './sections/MeetingInvitation';
import MeetingSetting from './sections/MeetingSetting';
import MeetingMoreSetting from './sections/MeetingMoreSetting';

interface Props {
  visible: boolean;
  onClose: () => void;
  meetingId?: number;
  zoneId?: number;
}

const PlanMeeting: FC<Props> = ({ onClose, visible, meetingId, zoneId }) => {
  const dispatch = useDispatch();
  const {
    zone: {
      getMultipleUserZones: { userZones },
    },
    meeting: {
      createMeeting: { loading },
      updateMeetingById: { loading: updateLoading },
      getOneMeeting: { loading: meetingLoading, meeting },
    },
  } = useSelector((state: AppState) => state);

  const [activeSection, setActiveSection] = useState(2);

  useEffect(() => {
    dispatch(getMultipleUserZonesAction());

    if (meetingId && zoneId) {
      dispatch(getMeetingByIdAction(zoneId, meetingId));
    }
  }, [meetingId, zoneId]);

  if (!visible) return null;

  const content = [
    {
      title: 'Meeting Details',
      component: <MeetingDetails />,
    },
    {
      title: 'Privacy',
      component: <MeetingPrivacy />,
    },
    {
      title: 'Invite',
      component: <MeetingInvitation />,
    },
    {
      title: 'More Settings',
      component: <MeetingSetting />,
    },
    {
      title: 'Even More Settings',
      component: <MeetingMoreSetting />,
    },
  ];

  const goBack = () => {
    setActiveSection(activeSection - 1);
  };
  const goNext = () => {
    setActiveSection(activeSection + 1);
  };

  const closeLayer = () => {
    setActiveSection(0);
    onClose();
  };
  return (
    <Layer onClickOutside={closeLayer}>
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
          <Button plain onClick={closeLayer}>
            <Close color="brand" />
          </Button>
        </Box>
        <Box direction="row" gap="small" justify="center">
          {content.map((item, i) => (
            <Box key={i} gap="small" direction="row" align="center">
              <Text
                size="small"
                weight={activeSection >= i ? 'bold' : 'normal'}
                color={activeSection >= i ? 'brand' : '#8F9BB3'}
              >
                {item.title}
              </Text>
              {i + 1 !== content.length && (
                <Box
                  background={activeSection >= i ? 'brand' : '#8F9BB3'}
                  height={activeSection >= i ? '2px' : '1px'}
                  width="48px"
                />
              )}
            </Box>
          ))}
        </Box>
        <Box height="275px">{content[activeSection]?.component}</Box>
        <Box direction="row" gap="small" justify="end">
          {activeSection !== 0 && (
            <Button
              primary
              size="small"
              label="Back"
              color="#8F9BB3"
              style={{
                width: 240,
                borderRadius: 10,
                height: 46,
                fontWeight: 'bold',
              }}
              onClick={() => goBack()}
            />
          )}
          <Button
            primary
            size="small"
            label="Go!"
            color="#6FFFB0"
            style={{
              color: 'brand',
              width: 240,
              borderRadius: 10,
              height: 46,
              fontWeight: 'bold',
            }}
            onClick={() => {}}
          />
          <Button
            primary
            size="small"
            label="Next"
            style={{
              width: 240,
              borderRadius: 10,
              height: 46,
              fontWeight: 'bold',
            }}
            disabled={activeSection === content.length - 1}
            onClick={() => goNext()}
          />
        </Box>
      </Box>
    </Layer>
  );
};

export default PlanMeeting;
