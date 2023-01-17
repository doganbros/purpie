import React, { useEffect, useState } from 'react';
import { Box, Button, DropButton, Stack, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill, Edit } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';

import {
  getUserChannelsAllAction,
  updateChannelInfoAction,
  updateChannelPhoto,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import AvatarUpload from './AvatarUpload';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const ChannelSettings: () => Menu = () => {
  const {
    channel: { userChannels },
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [selectedUserChannelIndex, setSelectedUserChannelIndex] = useState(0);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: '',
    description: '',
    id: '',
    public: userChannels?.data[0]?.channel?.public,
  });

  const [isDropOpen, setIsDropOpen] = useState(false);
  const { t } = useTranslation();

  const [showChannelSelector, setShowChannelSelector] = useState(true);

  const selectedChannel = userChannels.data[selectedUserChannelIndex]?.channel;
  const channelId = selectedChannel?.id;

  const isFormInitialState =
    channelPayload.name === selectedChannel?.name &&
    channelPayload.description === selectedChannel?.description &&
    channelPayload.public === selectedChannel?.public;

  useEffect(() => {
    dispatch(getUserChannelsAllAction());
  }, []);

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
              <Text> {t('settings.noChannel')}</Text>
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
    saveButton: (
      <Button
        disabled={isFormInitialState}
        onClick={() => {
          if (!(channelId === null || channelId === undefined)) {
            dispatch(updateChannelInfoAction(channelId, channelPayload));
          }
        }}
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
      />
    ),
    avatarWidget: (
      <>
        <Box width="medium" direction="row" gap="small" align="center">
          {!showChannelSelector && (
            <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
              <Box
                round="full"
                border={{ color: 'light-2', size: 'medium' }}
                wrap
                justify="center"
                pad="5px"
              >
                <ChannelAvatar
                  id={selectedChannel?.id}
                  name={selectedChannel?.name}
                  src={selectedChannel?.displayPhoto}
                />
              </Box>
              <Box background="focus" round pad="xsmall">
                <Edit size="small" />
              </Box>
            </Stack>
          )}
          <DropButton
            open={isDropOpen}
            onOpen={() => setIsDropOpen(true)}
            onClose={() => setIsDropOpen(false)}
            dropAlign={{ left: 'right', top: 'top' }}
            fill="vertical"
            dropContent={
              <Box width={{ min: '250px' }} overflow="auto">
                {userZones?.map((zone) => (
                  <Box
                    key={zone.zone.id}
                    flex={{ shrink: 0 }}
                    border={{ side: 'bottom', color: 'light-2' }}
                  >
                    {userChannels.data.filter(
                      (id) => id.channel.zoneId === zone.zone.id
                    ).length > 0 && (
                      <Box
                        style={{ pointerEvents: 'none' }}
                        pad="small"
                        gap="small"
                        direction="row"
                        align="center"
                        alignContent="center"
                      >
                        <ZoneAvatar id={zone.zone.id} name={zone.zone.name} />
                        <Text size="small">{zone.zone.name}</Text>
                      </Box>
                    )}
                    {userChannels.data.map(
                      (item, index) =>
                        item.channel.zoneId === zone.zone.id && (
                          <ListButton
                            pad={{
                              vertical: 'xsmall',
                              left: 'medium',
                              right: 'small',
                            }}
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
                              setIsDropOpen(false);
                            }}
                            leftIcon={
                              <ChannelAvatar
                                id={item.channel.id}
                                name={item.channel.name}
                                src={item.channel.displayPhoto}
                              />
                            }
                            selected={
                              selectedChannel.name === item.channel.name
                            }
                          />
                        )
                    )}
                  </Box>
                ))}
              </Box>
            }
          >
            {!showChannelSelector ? (
              <Box
                onClick={() => setIsDropOpen(true)}
                direction="row"
                gap="small"
                align="center"
              >
                <Box>
                  <Text>{selectedChannel?.name}</Text>
                  <Box direction="row" gap="small" align="center">
                    <ZoneBadge
                      truncateWith={15}
                      textProps={{ size: 'small' }}
                      subdomain={
                        userZones?.find(
                          (userZone) =>
                            userZone.zone.id === selectedChannel.zoneId
                        )?.zone.subdomain
                      }
                      name={
                        userZones?.find(
                          (userZone) =>
                            userZone.zone.id === selectedChannel.zoneId
                        )?.zone.name
                      }
                    />
                  </Box>
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
              dispatch(updateChannelPhoto(file, channelId));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
            type="channel"
            src={selectedChannel?.displayPhoto}
          />
        )}
      </>
    ),
    items: [
      {
        key: 'channelName',
        title: t('settings.channelName'),
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
              placeholder={t('settings.channelNamePlaceholder')}
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
              placeholder={t('settings.channelDescriptionPlaceholder')}
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
    ],
    isEmpty: showChannelSelector,
  };
};

export default ChannelSettings;
