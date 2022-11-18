import React, { useState } from 'react';
import { Box, CheckBox, DropButton, Grid, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';
import SectionContainer from '../../../components/utils/SectionContainer';
import { apiURL } from '../../../config/http';
import {
  changeChannelInformationAction,
  changeChannelPhoto,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import AvatarUpload from './AvatarUpload';
import { SettingsData } from './types';
import { ChannelAvatar } from '../../../components/Avatars/ChannelAvatar';

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
    canInvite: userChannels?.data[0]?.channelRole?.canInvite,
    canDelete: userChannels?.data[0]?.channelRole?.canDelete,
    canEdit: userChannels?.data[0]?.channelRole?.canEdit,
    canManageRole: userChannels?.data[0]?.channelRole?.canManageRole,
  });
  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: '',
    description: '',
    id: 1,
    public: userChannels?.data[0]?.channel?.public,
  });

  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const [showChannelSelector, setShowChannelSelector] = useState(true);

  const channelId = userChannels.data[selectedUserChannelIndex]?.channel?.id;

  if (userChannels.data.length === 0) {
    return {
      id: 1,
      key: 'channel',
      label: t('settings.channelSettings'),
      url: 'channel',
      items: [
        {
          key: 'channelName',
          title: '',
          description: '',
          value: 'value',
          component: (
            <Box
              direction="row"
              justify="between"
              align="center"
              gap="small"
              round="small"
              pad="xxsmall"
            >
              <Text />
            </Box>
          ),
        },
      ],
      isEmpty: true,
    };
  }

  return {
    id: 1,
    key: 'channel',
    label: t('settings.channelSettings'),
    url: 'channel',
    onSave: () => {
      if (!(channelId === null || channelId === undefined)) {
        dispatch(changeChannelInformationAction(channelId, channelPayload));
      }
    },
    avatarWidget: (
      <>
        <Box width="medium" direction="row" gap="small" align="center">
          {!showChannelSelector && (
            <ChannelAvatar
              id={1}
              title={
                userChannels?.data[selectedUserChannelIndex]?.channel?.name
              }
              onClickEdit={() => setShowAvatarUpload(true)}
              src={
                userChannels?.data[selectedUserChannelIndex]?.channel
                  ?.displayPhoto
                  ? `${apiURL}/channel/display-photo/${userChannels?.data[selectedUserChannelIndex]?.channel?.displayPhoto}`
                  : undefined
              }
              outerCircle
              editAvatar
            />
          )}
          <DropButton
            open={open}
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            dropAlign={{ left: 'right', top: 'top' }}
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
                      setShowChannelSelector(false);
                    }}
                    leftIcon={
                      <ChannelAvatar
                        id={Math.floor(Math.random() * 100)}
                        title={
                          userChannels.data[selectedUserChannelIndex].channel
                            .name
                        }
                        onClickEdit={() => setShowAvatarUpload(true)}
                        src={
                          item.channel.displayPhoto
                            ? `${apiURL}/channel/display-photo/${item.channel.displayPhoto}`
                            : undefined
                        }
                        outerCircle
                      />
                    }
                    selected={
                      userChannels.data[selectedUserChannelIndex].channel
                        .name === item.channel.name
                    }
                  />
                ))}
              </Box>
            }
          >
            {!showChannelSelector ? (
              <Box onClick={() => setOpen(true)} direction="row" gap="small">
                <Box>
                  <Text>
                    {
                      userChannels?.data[selectedUserChannelIndex]?.channel
                        ?.name
                    }
                  </Text>
                  <Text color="#8F9BB3">224 members</Text>
                  <Text color="#8F9BB3">
                    {t('settings.in')}{' '}
                    {
                      userZones?.find(
                        (userZone) =>
                          userZone.zone.id ===
                          userChannels.data[selectedUserChannelIndex].channel
                            .zoneId
                      )?.zone.name
                    }{' '}
                    {t('settings.zone')}
                  </Text>
                </Box>
                <CaretDownFill />
              </Box>
            ) : (
              <Box
                background="status-disabled-light"
                pad="medium"
                round="small"
                direction="row"
                align="center"
              >
                <Text>{t('settings.selectChannel')}</Text>
                <CaretRightFill color="brand" />{' '}
              </Box>
            )}
          </DropButton>
        </Box>
        {showAvatarUpload && !(channelId === null || channelId === undefined) && (
          <AvatarUpload
            onSubmit={(file: any) => {
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
        title: t('settings.channelName'),
        description: t('settings.changeChannelName'),
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
        title: t('settings.channelDescription'),
        description: t('settings.changeChannelDescription'),
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
        title: t('settings.permissions'),
        description: '',
        value: 'value',
        component: (
          <SectionContainer label={t('settings.userPermissions')}>
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
                focusIndicator={false}
                onClick={() =>
                  setChannelPermissions({
                    ...channelPermissions,
                    canEdit: !channelPermissions.canEdit,
                  })
                }
              >
                <Text>{t('settings.canEdit')}</Text>
                <CheckBox checked={channelPermissions.canEdit} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                focusIndicator={false}
                onClick={() =>
                  setChannelPermissions({
                    ...channelPermissions,
                    canDelete: !channelPermissions.canDelete,
                  })
                }
              >
                <Text>{t('settings.canDelete')}</Text>
                <CheckBox checked={channelPermissions.canDelete} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                focusIndicator={false}
                onClick={() =>
                  setChannelPermissions({
                    ...channelPermissions,
                    canInvite: !channelPermissions.canInvite,
                  })
                }
              >
                <Text>{t('settings.canInvite')}</Text>
                <CheckBox checked={channelPermissions.canInvite} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                focusIndicator={false}
                onClick={() =>
                  setChannelPermissions({
                    ...channelPermissions,
                    canManageRole: !channelPermissions.canManageRole,
                  })
                }
              >
                <Text>{t('settings.canManageRole')}</Text>
                <CheckBox checked={channelPermissions.canManageRole} />
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
          <SectionContainer label={t('settings.channelVisibility')}>
            <Grid rows={['xxsmall']} columns={['medium', 'medium']} gap="small">
              <Box
                direction="row"
                justify="between"
                gap="xsmall"
                onClick={() =>
                  setChannelPayload({
                    ...channelPayload,
                    public: !channelPayload.public,
                  })
                }
              >
                <Text>{t('settings.public')}</Text>
                <CheckBox checked={channelPayload.public} />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
    ],
    isEmpty: showChannelSelector,
  };
};

export default ChannelSettings;
