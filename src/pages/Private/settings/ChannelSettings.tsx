import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  DropButton,
  ResponsiveContext,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill, Edit } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';

import {
  deleteChannelAction,
  getUserChannelsAllAction,
  unfollowChannelAction,
  updateChannelInfoAction,
  updateChannelPhoto,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  UpdateChannelPayload,
  UserChannelListItem,
} from '../../../store/types/channel.types';
import AvatarUpload from './AvatarUpload';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import ChannelPermissions from '../../../layers/settings-and-static-pages/permissions/ChannelPermissions';

const ChannelSettings: () => Menu = () => {
  const {
    auth: { user },
    channel: { userChannels },
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);

  const [
    selectedUserChannel,
    setSelectedUserChannel,
  ] = useState<UserChannelListItem | null>(null);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: '',
    description: '',
    id: '',
    public: userChannels?.data[0]?.channel?.public,
  });

  const [isDropOpen, setIsDropOpen] = useState(false);
  const { t } = useTranslation();

  const [showChannelSelector, setShowChannelSelector] = useState(true);

  const isFormInitialState =
    channelPayload.name === selectedUserChannel?.channel.name &&
    channelPayload.description === selectedUserChannel?.channel.description &&
    channelPayload.public === selectedUserChannel?.channel.public;

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

  const result = {
    id: 1,
    key: 'channel',
    label: t('settings.channelSettings'),
    url: 'channel',
    saveButton: (
      <Button
        disabled={isFormInitialState}
        onClick={() => {
          if (selectedUserChannel) {
            dispatch(
              updateChannelInfoAction(
                selectedUserChannel.channel.id,
                channelPayload
              )
            );
          }
        }}
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
      />
    ),
    deleteButton: (
      <Button
        onClick={() => setShowDeletePopup(true)}
        primary
        color="red"
        label={t('common.delete')}
        margin={{ vertical: 'medium' }}
      />
    ),
    leaveButton: (
      <Button
        onClick={() => setShowLeavePopup(true)}
        secondary
        color="red"
        label={t('common.unfollow')}
        margin={{ vertical: 'medium' }}
      />
    ),
    avatarWidget: (
      <>
        <Box width="medium" direction="row" gap="small" align="center">
          {selectedUserChannel && (
            <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
              <Box
                round="full"
                border={{ color: 'light-2', size: 'medium' }}
                wrap
                justify="center"
                pad="5px"
              >
                <ChannelAvatar
                  id={selectedUserChannel?.channel.id}
                  name={selectedUserChannel?.channel.name}
                  src={selectedUserChannel?.channel.displayPhoto}
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
            dropAlign={
              size === 'small'
                ? { left: 'left', top: 'bottom' }
                : { left: 'right', top: 'top' }
            }
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
                        <ZoneAvatar
                          id={zone.zone.id}
                          name={zone.zone.name}
                          size="40px"
                        />
                        <Text size="small">{zone.zone.name}</Text>
                      </Box>
                    )}
                    {userChannels.data.map(
                      (item) =>
                        item.channel.zoneId === zone.zone.id && (
                          <ListButton
                            pad={{
                              vertical: 'xsmall',
                              left: 'medium',
                              right: 'small',
                            }}
                            key={item.channel.id}
                            label={item.channel.name}
                            subLabel={
                              user?.id !== item.channel?.createdBy?.id
                                ? 'Member'
                                : 'Owner'
                            }
                            onClick={() => {
                              setChannelPayload({
                                name: item.channel.name,
                                id: item.channel.id,
                                description: item.channel.description,
                                public: item.channel.public,
                              });
                              setSelectedUserChannel(item);
                              setShowChannelSelector(false);
                              setIsDropOpen(false);
                            }}
                            leftIcon={
                              <Box pad={{ vertical: '4px', left: 'small' }}>
                                <ChannelAvatar
                                  id={item.channel.id}
                                  name={item.channel.name}
                                  src={item.channel.displayPhoto}
                                  size="40px"
                                />
                              </Box>
                            }
                            selected={
                              selectedUserChannel?.channel.name ===
                              item.channel.name
                            }
                          />
                        )
                    )}
                  </Box>
                ))}
              </Box>
            }
          >
            {selectedUserChannel ? (
              <Box
                onClick={() => setIsDropOpen(true)}
                direction="row"
                gap="small"
                align="center"
              >
                <Box>
                  <EllipsesOverflowText
                    maxWidth="280px"
                    lineClamp={1}
                    text={selectedUserChannel?.channel.name}
                  />
                  <Box direction="row" gap="small" align="center">
                    <ZoneBadge
                      textProps={{ size: 'small' }}
                      subdomain={
                        userZones?.find(
                          (userZone) =>
                            userZone.zone.id ===
                            selectedUserChannel?.channel.zoneId
                        )?.zone.subdomain
                      }
                      name={
                        userZones?.find(
                          (userZone) =>
                            userZone.zone.id ===
                            selectedUserChannel?.channel.zoneId
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
                <CaretRightFill color="brand" />
              </Box>
            )}
          </DropButton>
        </Box>
        {showAvatarUpload && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(
                updateChannelPhoto(file, selectedUserChannel!.channel.id)
              );
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
            type="channel"
            src={selectedUserChannel?.channel.displayPhoto}
            id={selectedUserChannel?.channel.id}
            name={selectedUserChannel?.channel.name}
          />
        )}
      </>
    ),
    deletePopup: showDeletePopup && (
      <ConfirmDialog
        message={`${`${t('settings.deleteMessage')} ${
          selectedUserChannel?.channel.name
        }`} channel?`}
        onConfirm={() => {
          dispatch(deleteChannelAction(selectedUserChannel!.channel.id));
          setShowDeletePopup(false);
        }}
        onDismiss={() => setShowDeletePopup(false)}
        textProps={{ wordBreak: 'break-word' }}
      />
    ),
    leavePopup: showLeavePopup && (
      <ConfirmDialog
        message={`${`${t('settings.channelUnfollowMessage')} ${
          selectedUserChannel?.channel.name
        }`} channel?`}
        onConfirm={() => {
          dispatch(unfollowChannelAction(selectedUserChannel!.channel.id));
          setShowLeavePopup(false);
          setSelectedUserChannel(null);
        }}
        onDismiss={() => setShowLeavePopup(false)}
        textProps={{ wordBreak: 'break-word' }}
      />
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
    canDelete: selectedUserChannel?.channelRole.canDelete,
    showLeaveButton: user?.id !== selectedUserChannel?.channel.createdBy?.id,
  };
  if (selectedUserChannel && selectedUserChannel.channelRole?.canManageRole) {
    result.items.push({
      key: 'channelManagement',
      title: '',
      value: 'value',
      component: <ChannelPermissions userChannel={selectedUserChannel} />,
    });
  }

  return result;
};

export default ChannelSettings;
