import { Box, Button, ResponsiveContext } from 'grommet';
import { Add, Bookmark, Chat, Group, Home } from 'grommet-icons';
import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { SidebarButton } from './SidebarButton';
import PlanMeeting from '../../../layers/meeting/PlanMeeting';
import { closePlanCreateMeetingLayerAction } from '../../../store/actions/meeting.action';
import { closeCreateZoneLayerAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import AddContent from '../../../layers/add-content/AddContent';
import CreateZone from '../../../layers/create-zone/CreateZone';
import CreateChannel from '../../../layers/create-channel/CreateChannel';
import { closeCreateChannelLayerAction } from '../../../store/actions/channel.action';
import CreateVideo from '../../../layers/create-video/CreateVideo';
import { closeCreateVideoLayerAction } from '../../../store/actions/post.action';

const sidebarBtns = [
  {
    titleKey: 'home',
    icon: Home,
    path: '/',
  },
  // {
  //   title: 'Channels',
  //   icon: Channel,
  //   path: '/channels',
  // },
  {
    titleKey: 'messages',
    icon: Chat,
    path: '/messages',
  },
  {
    titleKey: 'contacts',
    icon: Group,
    path: '/contacts',
  },
  {
    titleKey: 'saved',
    icon: Bookmark,
    path: '/saved-posts',
  },
];

interface Props {
  handleClick?: () => void;
}

const Sidebar: FC<Props> = ({ handleClick }) => {
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);
  const { t } = useTranslation();

  const [showAddContent, setShowAddContent] = useState(false);
  const {
    meeting: { showPlanMeetingLayer },
    zone: { showCreateZoneLayer, selectedUserZone },
    channel: { showCreateChannelLayer },
    post: {
      createVideo: { showCreateVideoLayer },
    },
  } = useSelector((state: AppState) => state);

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
      {showCreateVideoLayer && (
        <CreateVideo
          onDismiss={() => dispatch(closeCreateVideoLayerAction())}
        />
      )}
      {!selectedUserZone || selectedUserZone.id ? (
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
            pad={{ vertical: 'xsmall', horizontal: 'small' }}
            margin={{ vertical: 'small' }}
          >
            <Add color="black" />
          </Box>
        </Button>
      ) : null}

      {sidebarBtns.map(({ titleKey, ...v }) => (
        <SidebarButton
          key={titleKey}
          title={t(`Sidebar.${titleKey}`)}
          handleClick={handleClick}
          {...v}
        />
      ))}
    </Box>
  );
};

export default Sidebar;
