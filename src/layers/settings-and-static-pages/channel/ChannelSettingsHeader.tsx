import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, DropButton, ResponsiveContext, Stack, Text } from 'grommet';
import { Camera, CaretDownFill, CaretRightFill } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';
import ListButton from '../../../components/utils/ListButton';
import AvatarUpload from '../../../pages/Private/settings/AvatarUpload';
import { AppState } from '../../../store/reducers/root.reducer';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import {
  updateChannelBackgroundPhotoAction,
  updateChannelPhoto,
} from '../../../store/actions/channel.action';
import { UserChannelListItem } from '../../../store/types/channel.types';
import { apiURL } from '../../../config/http';
import imagePlaceholder from '../../../assets/banner-placeholder.jpg';

interface ChannelSettingsHeaderProps {
  selectedUserChannel: UserChannelListItem | null;
  setSelectedUserChannel: (zone: UserChannelListItem) => void;
}

const WIDTH = '450px';
const HEIGHT = '249px';

const ChannelSettingsHeader: FC<ChannelSettingsHeaderProps> = ({
  selectedUserChannel,
  setSelectedUserChannel,
}) => {
  const {
    channel: { userChannels },
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    if (selectedUserChannel) {
      const userChannel = userChannels.data.find(
        (c) => c.id === selectedUserChannel.id
      );
      if (userChannel) setSelectedUserChannel(userChannel);
    }
  }, [userChannels]);

  const size = useContext(ResponsiveContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showBackgroundPhotoUpload, setShowBackgroundPhotoUpload] = useState(
    false
  );
  const [isDropOpen, setIsDropOpen] = useState(false);

  const getBackgroundImageURL = () => {
    if (!selectedUserChannel) return undefined;
    if (
      selectedUserChannel.channel &&
      selectedUserChannel.channel.backgroundPhoto
    ) {
      return `url(${apiURL}/channel/background-photo/${selectedUserChannel.channel.backgroundPhoto})`;
    }

    return `url(${imagePlaceholder})`;
  };

  const avatarUploadContent = (
    <AvatarUpload
      onSubmit={(file: any) => {
        dispatch(updateChannelPhoto(file, selectedUserChannel!.id!));
        setShowAvatarUpload(false);
      }}
      onDismiss={() => {
        setShowAvatarUpload(false);
      }}
      type="channel/display-photo"
      src={selectedUserChannel?.channel.displayPhoto}
      id={selectedUserChannel?.channel.id}
      name={selectedUserChannel?.channel.name}
    />
  );

  const bgPhotoUploadContent = (
    <AvatarUpload
      onSubmit={(file: any) => {
        if (selectedUserChannel && file && selectedUserChannel?.id) {
          dispatch(
            updateChannelBackgroundPhotoAction(file, selectedUserChannel.id)
          );
          setShowBackgroundPhotoUpload(false);
        }
      }}
      onDismiss={() => {
        setShowBackgroundPhotoUpload(false);
      }}
      type="channel/background-photo"
      src={selectedUserChannel?.channel.backgroundPhoto || 'default'}
      id={selectedUserChannel?.channel.id}
      name={selectedUserChannel?.channel.name}
    />
  );

  const dropContent = (
    <Box width={{ min: '250px' }} overflow="auto">
      {userZones?.map((zone) => (
        <Box
          key={zone.zone.id}
          flex={{ shrink: 0 }}
          border={{ side: 'bottom', color: 'light-2' }}
        >
          {userChannels.data.filter((id) => id.channel.zoneId === zone.zone.id)
            .length > 0 && (
            <Box
              className="pointer-events--none"
              pad="small"
              gap="small"
              direction="row"
              align="center"
              alignContent="center"
            >
              <ZoneAvatar id={zone.zone.id} name={zone.zone.name} size="40px" />
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
                  subLabel={t(`Permissions.${item.channelRole.roleCode}`)}
                  onClick={() => {
                    setSelectedUserChannel(item);
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
                    selectedUserChannel?.channel.name === item.channel.name
                  }
                />
              )
          )}
        </Box>
      ))}
    </Box>
  );

  return (
    <>
      <Box
        width={selectedUserChannel ? WIDTH : undefined}
        direction="row"
        gap="small"
        align="end"
        background={{
          image: getBackgroundImageURL(),
        }}
        height={selectedUserChannel ? HEIGHT : undefined}
        className="position--relative"
        round="small"
        pad={{ bottom: '20px' }}
      >
        {selectedUserChannel && (
          <>
            <Box
              width={WIDTH}
              height={HEIGHT}
              background="linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.99))"
              className="position--absolute top--0"
            />
            <Box
              background="focus"
              round
              pad="xsmall"
              className="position--absolute top-right"
              onClick={() => setShowBackgroundPhotoUpload(true)}
            >
              <Camera size="small" />
            </Box>
          </>
        )}

        <Box direction="row" gap="small" className="z-index--1">
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
                <Camera size="small" />
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
            dropContent={dropContent}
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
      </Box>
      {showAvatarUpload && avatarUploadContent}
      {showBackgroundPhotoUpload && bgPhotoUploadContent}
    </>
  );
};

export default ChannelSettingsHeader;
