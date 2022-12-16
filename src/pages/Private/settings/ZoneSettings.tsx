import React, { useState } from 'react';
import { Box, Button, DropButton, Stack, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill, Edit } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateZonePayload } from '../../../store/types/zone.types';
import { SettingsData } from './types';
import {
  updateZoneInfoAction,
  updateZonePhotoAction,
} from '../../../store/actions/zone.action';
import AvatarUpload from './AvatarUpload';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';

const ZoneSettings: () => SettingsData | null = () => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [selectedUserZoneIndex, setSelectedUserZoneIndex] = useState(0);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const { t } = useTranslation();

  const [showZoneSelector, setShowZoneSelector] = useState(true);
  const [isDropOpen, setIsDropOpen] = useState(false);

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>({
    name: '',
    description: '',
    subdomain: '',
    id: userZones?.[0]?.zone?.id || 0,
    public: userZones?.[0]?.zone?.public || false,
  });

  if (userZones?.length === 0) {
    return {
      id: 2,
      key: 'zone',
      label: t('settings.zoneSettings'),
      url: 'zone',
      items: [
        {
          key: 'zoneName',
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
              <Text>{t('settings.noZone')}</Text>
            </Box>
          ),
        },
      ],
      isEmpty: true,
    };
  }

  const selectedZone = userZones?.[selectedUserZoneIndex]?.zone;
  const zoneId = selectedZone?.id;

  const isFormInitialState =
    zonePayload.name === selectedZone?.name &&
    zonePayload.description === selectedZone?.description &&
    zonePayload.subdomain === selectedZone?.subdomain &&
    zonePayload.public === selectedZone?.public;

  return {
    id: 2,
    key: 'zone',
    label: t('settings.zoneSettings'),
    url: 'zone',
    saveButton: (
      <Button
        disabled={isFormInitialState}
        onClick={() => {
          if (!(zoneId === null || zoneId === undefined)) {
            dispatch(updateZoneInfoAction(zoneId, zonePayload));
          }
        }}
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
      />
    ),
    avatarWidget: (
      <Box direction="row" gap="small" align="center">
        {!showZoneSelector && (
          <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
            <Box
              round={{ size: 'medium' }}
              border={{ color: '#F2F2F2', size: 'medium' }}
              wrap
              justify="center"
              pad="5px"
            >
              <ZoneAvatar
                id={selectedZone?.id || 1}
                name={selectedZone?.name}
                src={selectedZone?.displayPhoto}
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
          dropProps={{
            responsive: false,
            stretch: false,
            overflow: { vertical: 'scroll' },
          }}
          dropAlign={{ left: 'right', top: 'top' }}
          dropContent={
            <Box>
              {userZones?.map((item, index) => (
                <ListButton
                  label={item.zone.name}
                  key={item.zone.id}
                  onClick={() => {
                    setZonePayload({
                      name: item.zone.name,
                      id: item.zone.id,
                      subdomain: item.zone.subdomain,
                      public: item.zone.public,
                      description: item.zone.description,
                    });
                    setSelectedUserZoneIndex(index);
                    setShowZoneSelector(false);
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
          }
        >
          {!showZoneSelector ? (
            <Box direction="row" align="center">
              <Box>
                <Text>{selectedZone?.name}</Text>
                <Text color="#8F9BB3">{selectedZone?.subdomain}</Text>
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
              <CaretRightFill color="brand" />{' '}
            </Box>
          )}
        </DropButton>
        {showAvatarUpload && !(zoneId === null) && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(updateZonePhotoAction(file, zoneId || 1));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
            type="zone"
            src={selectedZone?.displayPhoto}
          />
        )}
      </Box>
    ),
    items: [
      {
        key: 'zoneName',
        title: t('settings.zoneName'),
        description: t('settings.changeZoneName'),
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
              value={zonePayload.name}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setZonePayload({
                  ...zonePayload,
                  name: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'zoneTitle',
        title: t('settings.zoneSubdomain'),
        description: t('settings.changeZoneSubdomain'),
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
              value={zonePayload.subdomain}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setZonePayload({
                  ...zonePayload,
                  subdomain: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'zoneDescription',
        title: t('settings.zoneDescription'),
        description: t('settings.changeZoneDescription'),
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
              value={zonePayload.description}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setZonePayload({
                  ...zonePayload,
                  description: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
    ],
    isEmpty: showZoneSelector,
  };
};

export default ZoneSettings;
