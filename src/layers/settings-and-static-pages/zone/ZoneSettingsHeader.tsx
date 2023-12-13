import React, { FC, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, DropButton, ResponsiveContext, Stack, Text } from 'grommet';
import { Camera, CaretDownFill, CaretRightFill } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';
import ListButton from '../../../components/utils/ListButton';
import AvatarUpload from '../../../pages/Private/settings/AvatarUpload';
import { updateZonePhotoAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UserZoneListItem } from '../../../store/types/zone.types';

interface ZoneSettingsHeaderProps {
  selectedZone: UserZoneListItem | null;
  setSelectedZone: (zone: UserZoneListItem) => void;
}

const ZoneSettingsHeader: FC<ZoneSettingsHeaderProps> = ({
  selectedZone,
  setSelectedZone,
}) => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  const size = useContext(ResponsiveContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [isDropOpen, setIsDropOpen] = useState(false);

  useEffect(() => {
    if (selectedZone) {
      const userZone = userZones?.find((c) => c.id === selectedZone.id);
      if (userZone) setSelectedZone(userZone);
    }
  }, [userZones]);

  const avatarUploadContent = (
    <AvatarUpload
      onSubmit={(file: any) => {
        dispatch(updateZonePhotoAction(file, selectedZone!.id!));
        setShowAvatarUpload(false);
      }}
      onDismiss={() => {
        setShowAvatarUpload(false);
      }}
      type="zone/display-photo"
      src={selectedZone?.zone.displayPhoto}
      id={selectedZone?.zone.id}
      name={selectedZone?.zone.name}
    />
  );

  const dropContent = (
    <Box width={{ min: '250px' }} overflow="auto">
      {userZones?.map((item) => (
        <ListButton
          label={item.zone.name}
          subLabel={t(`Permissions.${item.zoneRole.roleCode}`)}
          key={item.zone.id}
          onClick={() => {
            setSelectedZone(item);
            setIsDropOpen(false);
          }}
          leftIcon={
            <ZoneAvatar
              id={item.zone.id}
              name={item.zone.name}
              src={item.zone.displayPhoto}
              outerCircle
            />
          }
        />
      ))}
    </Box>
  );

  return (
    <Box direction="row" gap="small" align="center">
      {selectedZone && (
        <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
          <Box
            round={{ size: 'medium' }}
            border={{ color: 'light-2', size: 'medium' }}
            wrap
            justify="center"
            pad="5px"
          >
            <ZoneAvatar
              id={selectedZone!.zone.id}
              name={selectedZone!.zone.name}
              src={selectedZone!.zone.displayPhoto}
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
        dropProps={{
          responsive: false,
          stretch: false,
        }}
        dropAlign={
          size === 'small'
            ? { left: 'left', top: 'bottom' }
            : { left: 'right', top: 'top' }
        }
        dropContent={dropContent}
      >
        {selectedZone ? (
          <Box direction="row" align="center">
            <Box>
              <Text>{selectedZone.zone.name}</Text>
              <Text color="status-disabled">
                {t(`Permissions.${selectedZone.zoneRole.roleCode}`)}
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
            justify="center"
          >
            <Text>{t('settings.selectZone')}</Text>
            <CaretRightFill color="brand" />
          </Box>
        )}
      </DropButton>
      {showAvatarUpload && selectedZone && avatarUploadContent}
    </Box>
  );
};

export default ZoneSettingsHeader;
