import { useParams } from 'react-router-dom';
import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Text,
  TextInput,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Edit, Info, Search, Trash } from 'grommet-icons';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  closeUpdateMeetingLayerAction,
  deleteMeetingByIdAction,
  getMultipleMeetingsByZoneIdAction,
  openUpdateMeetingLayerAction,
} from '../../../store/actions/meeting.action';
import CreateUpdateMeeting from '../../../layers/meeting/CreateUpdateMeeting';

interface Params {
  zoneId: string;
}
const MeetingsByZone: FC = () => {
  const dispatch = useDispatch();
  const { zoneId } = useParams<Params>();

  const [meetingUpdating, setMeetingUpdating] = useState<number | null>(null);

  const {
    getMultipleMeetingsByZoneId: { meetingsByZoneId, loading },
    deleteMeetingById: { loading: deleteLoading },
    createMeeting: { loading: createLoading },
    updateMeetingById: { layerIsVisible },
  } = useSelector((state: AppState) => state.meeting);

  useEffect(() => {
    if (!deleteLoading || !createLoading)
      dispatch(getMultipleMeetingsByZoneIdAction(Number.parseInt(zoneId, 10)));
  }, [deleteLoading, createLoading]);

  const onClose = () => {
    dispatch(closeUpdateMeetingLayerAction);
    setMeetingUpdating(null);
  };

  const onOpen = (id: number) => {
    setMeetingUpdating(id);
    dispatch(openUpdateMeetingLayerAction);
  };

  return (
    <PrivatePageLayout
      title="Meetings By Zone"
      rightSideItem={
        <Box flex={{ grow: 2 }}>
          <Box
            pad={{ horizontal: 'medium' }}
            style={{ position: 'fixed' }}
            height="100%"
            overflow="auto"
          >
            <Box fill="horizontal" margin={{ vertical: 'medium' }} gap="medium">
              <TextInput icon={<Search />} placeholder="Search..." />
            </Box>
            <Card background="brand">
              <CardBody pad="small">
                <Box gap="small" align="center" pad="small">
                  <Info size="large" />
                  <Box>
                    <Text>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Corporis, quam.
                    </Text>
                  </Box>
                </Box>
              </CardBody>
              <CardFooter pad={{ horizontal: 'medium', vertical: 'small' }}>
                <Text size="xsmall">12 components</Text>
              </CardFooter>
            </Card>
          </Box>
        </Box>
      }
    >
      <CreateUpdateMeeting
        meetingId={meetingUpdating || undefined}
        visible={!!meetingUpdating && layerIsVisible}
        onClose={onClose}
      />

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        meetingsByZoneId?.map((meeting) => (
          <Card
            flex={false}
            width={{ max: '1000px' }}
            margin={{ bottom: 'medium' }}
            background={{ light: 'light-1', dark: 'dark-1' }}
            key={meeting.id}
          >
            <CardHeader pad="medium">{meeting.title}</CardHeader>
            <CardBody pad="medium">{meeting.description}</CardBody>
            <CardFooter
              pad={{ horizontal: 'small' }}
              background={{ light: 'light-2', dark: 'dark-2' }}
            >
              <Button
                onClick={() => onOpen(meeting.id)}
                icon={<Edit />}
                hoverIndicator
              />
              <Button
                onClick={() => dispatch(deleteMeetingByIdAction(meeting.id))}
                color="status-error"
                icon={<Trash />}
                hoverIndicator
              />
            </CardFooter>
          </Card>
        ))
      )}

      {meetingsByZoneId?.length === 0 ? (
        <Text>No Meeting Available</Text>
      ) : null}
    </PrivatePageLayout>
  );
};

export default MeetingsByZone;
