import React, { useState } from 'react';
import { Box, CheckBox, DropButton, Grid, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import ListButton from '../../../components/utils/ListButton';
import SectionContainer from '../../../components/utils/SectionContainer';
import { apiURL } from '../../../config/http';
import {
  changeChannelInformationAction,
  changeChannelPhoto,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import { AvatarItem } from './AvatarItem';
import AvatarUpload from './AvatarUpload';
import { SettingsData } from './types';

const ChannelSettings: () => SettingsData = () => {
  const {
    channel: { userChannels },
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [selectedUserChannelIndex, setSelectedUserChannelIndex] = useState(0);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [channelPermissions, setChannelPermissions] = useState({
    canInvite: userChannels.data[0].channelRole.canInvite,
    canDelete: userChannels.data[0].channelRole.canDelete,
    canEdit: userChannels.data[0].channelRole.canEdit,
    canManageRole: userChannels.data[0].channelRole.canManageRole,
  });
  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: userChannels.data[0].channel.name,
    description: userChannels.data[0].channel.description,
    id: userChannels.data[0].channel.id,
    public: userChannels.data[0].channel.public,
  });
  const channelId = userChannels.data[selectedUserChannelIndex]?.channel?.id;

  return {
    id: 1,
    key: 'channel',
    label: 'Channel Settings',
    url: 'channel',
    onSave: () => {
      if (!(channelId === null || channelId === undefined)) {
        dispatch(changeChannelInformationAction(channelId, channelPayload));
      }
    },
    avatarWidget: (
      <>
        <DropButton
          dropProps={{
            responsive: false,
            stretch: false,
            overflow: { vertical: 'scroll' },
          }}
          dropContent={
            <Box>
              {userChannels.data.map((item, index) => (
                <ListButton
                  key={item.channel.id}
                  label={item.channel.name}
                  onClick={() => {
                    setChannelPayload({
                      name: item.channel.name,
                      id: item.channel.id,
                      description: item.channel.description,
                      public: item.channel.public,
                    });
                    setSelectedUserChannelIndex(index);
                  }}
                />
              ))}
            </Box>
          }
        >
          <AvatarItem
            title={userChannels.data[selectedUserChannelIndex].channel.name}
            subtitle={
              userZones?.find(
                (userZone) =>
                  userZone.zone.id ===
                  userChannels.data[selectedUserChannelIndex].channel.zoneId
              )?.zone.name
            }
            onClickEdit={() => setShowAvatarUpload(true)}
            src={`${apiURL}/channel/display-photo/${userChannels.data[selectedUserChannelIndex].channel.displayPhoto}`}
          />
        </DropButton>
        {showAvatarUpload && !(channelId === null || channelId === undefined) && (
          <AvatarUpload
            onSubmit={(file) => {
              dispatch(changeChannelPhoto(file, channelId));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
          />
        )}
      </>
    ),
    items: [
      {
        key: 'channelName',
        title: 'Channel Name',
        description: 'Change channel name',
        value: 'value',
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            pad="xxsmall"
          >
            <TextInput
              value={channelPayload.name}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setChannelPayload({
                  ...channelPayload,
                  name: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'channelTitle',
        title: 'Channel Description',
        description: 'Change channel description',
        value: 'value',
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            pad="xxsmall"
          >
            <TextInput
              value={channelPayload.description}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setChannelPayload({
                  ...channelPayload,
                  description: event.target.value,
                })
              }
            />
          </Box>
        ),
      },

      {
        key: 'usersPermissions',
        title: 'Permissions',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="User Permissions">
            <Grid
              rows={['xxsmall', 'xxsmall']}
              columns={['medium', 'medium']}
              gap="small"
            >
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can edit</Text>
                <CheckBox
                  checked={channelPermissions.canEdit}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canEdit: !channelPermissions.canEdit,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can delete</Text>
                <CheckBox
                  checked={channelPermissions.canDelete}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canDelete: !channelPermissions.canDelete,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can invite</Text>
                <CheckBox
                  checked={channelPermissions.canInvite}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canInvite: !channelPermissions.canInvite,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can manage role</Text>
                <CheckBox
                  checked={channelPermissions.canManageRole}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canManageRole: !channelPermissions.canManageRole,
                    })
                  }
                />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
      {
        key: 'channelPublic',
        title: '',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="Channel Visibility">
            <Grid rows={['xxsmall']} columns={['medium', 'medium']} gap="small">
              <Box direction="row" justify="between" gap="xsmall">
                <Text>Public</Text>
                <CheckBox
                  checked={channelPayload.public}
                  onChange={() =>
                    setChannelPayload({
                      ...channelPayload,
                      public: !channelPayload.public,
                    })
                  }
                />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
    ],
  };
};

export default ChannelSettings;
