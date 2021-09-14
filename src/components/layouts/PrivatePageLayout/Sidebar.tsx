import { Box, Button, Menu, ResponsiveContext } from 'grommet';
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
import React, { FC, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarButton } from './SidebarButton';
import PlanMeeting from '../../../layers/meeting/PlanMeeting';
import { logoutAction } from '../../../store/actions/auth.action';
import { closePlanCreateMeetingLayerAction } from '../../../store/actions/meeting.action';
import { closeCreateZoneLayerAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import AddContent from '../../../layers/add-content/AddContent';
import ExtendedBox from '../../utils/ExtendedBox';
import CreateZone from '../../../layers/create-zone/CreateZone';
import CreateChannel from '../../../layers/create-channel/CreateChannel';
import { closeCreateChannelLayerAction } from '../../../store/actions/channel.action';

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
  const size = useContext(ResponsiveContext);

  const [showAddContent, setShowAddContent] = useState(false);
  const {
    meeting: { showPlanMeetingLayer },
    zone: { showCreateZoneLayer },
    channel: { showCreateChannelLayer },
  } = useSelector((state: AppState) => state);

  const logout = () => dispatch(logoutAction());

  return (
    <Box gap={size === 'small' ? 'large' : 'small'}>
      <PlanMeeting
        visible={showPlanMeetingLayer}
        onClose={() => dispatch(closePlanCreateMeetingLayerAction)}
      />
      {showAddContent && (
        <AddContent onDismiss={() => setShowAddContent(false)} />
      )}
      {showCreateZoneLayer && (
        <CreateZone onDismiss={() => dispatch(closeCreateZoneLayerAction())} />
      )}
      {showCreateChannelLayer && (
        <CreateChannel
          onDismiss={() => dispatch(closeCreateChannelLayerAction())}
        />
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
      <ExtendedBox opacity="0.5">
        <Box
          alignSelf="center"
          background="white"
          width="30px"
          height="3px"
          margin={
            size === 'small'
              ? { top: 'small', bottom: 'large' }
              : { vertical: 'medium' }
          }
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
          icon={<SettingsOption color="white" />}
        />
      </ExtendedBox>
    </Box>
  );
};

export default Sidebar;
