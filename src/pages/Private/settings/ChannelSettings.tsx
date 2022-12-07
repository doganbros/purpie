import React, { useState } from 'react';
import { Box, DropButton, Stack, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill, Edit } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';

import {
  changeChannelInformationAction,
  changeChannelPhoto,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import AvatarUpload from './AvatarUpload';
import { SettingsData } from './types';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';

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
  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: '',
    description: '',
    id: 1,
    public: userChannels?.data[0]?.channel?.public,
  });

  const [isDropOpen, setIsDropOpen] = useState(false);
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
    onSave: () => {
      if (!(channelId === null || channelId === undefined)) {
        dispatch(changeChannelInformationAction(channelId, channelPayload));
      }
    },
    avatarWidget: (
      <>
        <Box width="medium" direction="row" gap="small" align="center">
          {!showChannelSelector && (
            <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
              <Box
                round="full"
                border={{ color: '#F2F2F2', size: 'medium' }}
                wrap
                justify="center"
                pad="5px"
              >
                <ChannelAvatar
                  id={userChannels?.data[selectedUserChannelIndex]?.channel?.id}
                  name={
                    userChannels?.data[selectedUserChannelIndex]?.channel?.name
                  }
                  src={
                    userChannels?.data[selectedUserChannelIndex]?.channel
                      ?.displayPhoto
                  }
                />
              </Box>
              <Box background="#6FFFB0" round pad="xsmall">
                <Edit size="small" />
              </Box>
            </Stack>
          )}
          <DropButton
            open={isDropOpen}
            onOpen={() => setIsDropOpen(true)}
            onClose={() => setIsDropOpen(false)}
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
                      userChannels.data[selectedUserChannelIndex].channel
                        .name === item.channel.name
                    }
                  />
                ))}
              </Box>
            }
          >
            {!showChannelSelector ? (
              <Box
                onClick={() => setIsDropOpen(true)}
                direction="row"
                gap="small"
              >
                <Box>
                  <Text>
                    {
                      userChannels?.data[selectedUserChannelIndex]?.channel
                        ?.name
                    }
                  </Text>
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
    ],
    isEmpty: showChannelSelector,
  };
};

export default ChannelSettings;
