import { Box, Button, Menu } from 'grommet';
import {
  Add,
  Bookmark,
  Channel,
  Chat,
  Group,
  Home,
  Logout,
  SettingsOption,
} from 'grommet-icons';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarButton } from './SidebarButton';
import CreateUpdateMeeting from '../../../layers/meeting/CreateUpdateMeeting';
import CreateUpdateZone from '../../../layers/zone/CreateUpdateZone';
import { logoutAction } from '../../../store/actions/auth.action';
import { closeCreateMeetingLayerAction } from '../../../store/actions/meeting.action';
import { closeCreateZoneLayerAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import AddContent from '../../../layers/add-content/AddContent';

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
  const [showAddContent, setShowAddContent] = useState(false);
  const {
    zone: {
      createZone: { layerIsVisible: createZoneVisible },
    },
    meeting: {
      createMeeting: { layerIsVisible: createMeetingVisible },
    },
  } = useSelector((state: AppState) => state);

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
      {showAddContent && (
        <AddContent onDismiss={() => setShowAddContent(false)} />
      )}
      <Button
        onClick={() => {
          setShowAddContent(true);
        }}
        alignSelf="center"
      >
        <Box
          alignSelf="center"
          width="min-content"
          background="accent-4"
          round="small"
          pad={{ vertical: 'xxsmall', horizontal: 'xsmall' }}
          margin={{ vertical: 'small' }}
        >
          <Add color="dark-1" />
        </Box>
      </Button>

      {sidebarBtns.map((v) => (
        <SidebarButton key={v.title} {...v} />
      ))}
      <Box
        alignSelf="center"
        background="dark-6"
        width="30px"
        height="3px"
        margin={{ vertical: 'medium' }}
      />
      <Menu
        alignSelf="center"
        items={[
          {
            label: <Box pad={{ left: 'xsmall' }}>Logout</Box>,
            onClick: logout,
            icon: <Logout />,
          },
        ]}
        icon={<SettingsOption color="dark-6" />}
      />
    </>
  );
};

export default Sidebar;
