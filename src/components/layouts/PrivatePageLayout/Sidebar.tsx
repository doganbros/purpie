import { Box, Menu, Text } from 'grommet';
import {
  Add,
  Bookmark,
  Channel,
  Chat,
  CloudComputer,
  Group,
  Home,
  Logout,
  User,
} from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarButton } from './SidebarButton';
import CreateUpdateMeeting from '../../../layers/meeting/CreateUpdateMeeting';
import CreateUpdateZone from '../../../layers/zone/CreateUpdateZone';
import { logoutAction } from '../../../store/actions/auth.action';
import {
  closeCreateMeetingLayerAction,
  openCreateMeetingLayerAction,
} from '../../../store/actions/meeting.action';
import {
  closeCreateZoneLayerAction,
  openCreateZoneLayerAction,
} from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';

const sidebarBtns = [
  {
    title: 'Home',
    icon: Home,
    path: '/',
  },
  {
    title: 'Channels',
    icon: Channel,
    path: '/channels',
  },
  {
    title: 'Messages',
    icon: Chat,
    path: '/messages',
  },
  {
    title: 'Contacts',
    icon: Group,
    path: '/contacts',
  },
  {
    title: 'Saved Videos',
    icon: Bookmark,
    path: '/saved_videos',
  },
];

const Sidebar: FC = () => {
  const dispatch = useDispatch();
  const {
    zone: {
      createZone: { layerIsVisible: createZoneVisible },
    },
    meeting: {
      createMeeting: { layerIsVisible: createMeetingVisible },
    },
  } = useSelector((state: AppState) => state);

  const data = [
    {
      label: (
        <Box pad={{ left: 'xsmall' }}>
          <Text size="large">Meeting</Text>
        </Box>
      ),
      state: 'Meeting',
      onClick: () => dispatch(openCreateMeetingLayerAction),
      icon: <Group size="medium" />,
    },
    {
      label: (
        <Box pad={{ horizontal: 'xsmall' }}>
          <Text size="large">Zone</Text>
        </Box>
      ),
      onClick: () => dispatch(openCreateZoneLayerAction),
      state: 'Zone',
      icon: <CloudComputer size="medium" />,
    },
  ];

  const logout = () => dispatch(logoutAction);
  return (
    <>
      <CreateUpdateZone
        visible={createZoneVisible}
        onClose={() => dispatch(closeCreateZoneLayerAction)}
      />
      <CreateUpdateMeeting
        visible={createMeetingVisible}
        onClose={() => dispatch(closeCreateMeetingLayerAction)}
      />
      <Menu alignSelf="center" items={data} label="Add">
        <Box
          width="min-content"
          background="accent-4"
          round="small"
          pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
          margin={{ vertical: 'small' }}
        >
          <Add color="dark-1" />
        </Box>
      </Menu>
      {sidebarBtns.map((v) => (
        <SidebarButton key={v.title} {...v} />
      ))}
      <Menu
        alignSelf="center"
        items={[
          {
            label: <Box pad={{ left: 'xsmall' }}>Logout</Box>,
            onClick: logout,
            icon: <Logout />,
          },
        ]}
        icon={<User />}
      />
    </>
  );
};

export default Sidebar;
