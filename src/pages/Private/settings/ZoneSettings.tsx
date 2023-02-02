import React, { useState } from 'react';
import { Box, Button, DropButton, Stack, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill, Edit } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateZonePayload } from '../../../store/types/zone.types';
import {
  deleteZoneAction,
  leaveZoneAction,
  updateZoneInfoAction,
  updateZonePhotoAction,
} from '../../../store/actions/zone.action';
import AvatarUpload from './AvatarUpload';
import { ZoneAvatar } from '../../../components/utils/Avatars/ZoneAvatar';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import ConfirmDialog from '../../../components/utils/ConfirmDialog';

const ZoneSettings: () => Menu | null = () => {
  const {
    auth: { user },
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [selectedUserZoneIndex, setSelectedUserZoneIndex] = useState(0);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showLeavePopup, setShowLeavePopup] = useState(false);
  const { t } = useTranslation();

  const [showZoneSelector, setShowZoneSelector] = useState(true);
  const [isDropOpen, setIsDropOpen] = useState(false);

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>({
    name: '',
    description: '',
    subdomain: '',
    id: userZones?.[0]?.zone?.id || '',
    public: userZones?.[0]?.zone?.public || false,
  });

  const showLeaveButton =
    user?.id !== userZones?.[selectedUserZoneIndex]?.zone?.createdBy?.id;

  const isOwner = !showLeaveButton ? t('settings.owner') : t('settings.member');

  const upperZoneId = userZones?.[selectedUserZoneIndex]?.id;

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
  const canDelete = userZones?.[selectedUserZoneIndex]?.zoneRole.canDelete;

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
    deleteButton: (
      <Button
        onClick={() => {
          if (!(zoneId === null || zoneId === undefined)) {
            setShowDeletePopup(true);
          }
        }}
        primary
        color="red"
        label={t('common.delete')}
        margin={{ vertical: 'medium' }}
      />
    ),
    deletePopup: showDeletePopup && (
      <ConfirmDialog
        message={`${`${t('settings.deleteMessage')} 
   ${'\n'}
        ${selectedZone?.name}`} zone?`}
        onConfirm={() => {
          if (!(zoneId === null || zoneId === undefined)) {
            dispatch(deleteZoneAction(zoneId));
          }
          setShowDeletePopup(false);
        }}
        onDismiss={() => setShowDeletePopup(false)}
        textProps={{ wordBreak: 'break-word' }}
      />
    ),
    leaveButton: (
      <Button
        onClick={() => {
          if (!(zoneId === null || zoneId === undefined)) {
            setShowLeavePopup(true);
          }
        }}
        secondary
        color="red"
        label={t('common.leave')}
        margin={{ vertical: 'medium' }}
      />
    ),
    leavePopup: showLeavePopup && (
      <ConfirmDialog
        message={`${`${t('settings.zoneLeaveMessage')}
        ${'\n'}
        ${selectedZone?.name}`} zone?`}
        onConfirm={() => {
          if (!(upperZoneId === null || upperZoneId === undefined)) {
            dispatch(leaveZoneAction(upperZoneId));
          }
          setShowLeavePopup(false);
        }}
        onDismiss={() => setShowLeavePopup(false)}
        textProps={{ wordBreak: 'break-word' }}
      />
    ),
    avatarWidget: (
      <Box direction="row" gap="small" align="center">
        {!showZoneSelector && (
          <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
            <Box
              round={{ size: 'medium' }}
              border={{ color: 'light-2', size: 'medium' }}
              wrap
              justify="center"
              pad="5px"
            >
              <ZoneAvatar
                id={selectedZone?.id || ''}
                name={selectedZone?.name}
                src={selectedZone?.displayPhoto}
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
          dropProps={{
            responsive: false,
            stretch: false,
          }}
          dropAlign={{ left: 'right', top: 'top' }}
          dropContent={
            <Box width={{ min: '250px' }} overflow="auto">
              {userZones?.map((item, index) => (
                <ListButton
                  label={item.zone.name}
                  subLabel={
                    item.zone.createdBy?.id === user?.id
                      ? t('settings.owner')
                      : t('settings.member')
                  }
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
                <Text color="status-disabled">{isOwner}</Text>
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
        {showAvatarUpload && !(upperZoneId === null) && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(updateZonePhotoAction(file, upperZoneId!));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
            type="zone"
            src={selectedZone?.displayPhoto}
            id={selectedZone?.id || ''}
            name={selectedZone?.name}
          />
        )}
      </Box>
    ),
    items: [
      {
        key: 'zoneName',
        title: t('settings.zoneName'),
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
              placeholder={t('settings.zoneNamePlaceholder')}
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
              placeholder={t('settings.zoneSubdomainPlaceholder')}
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
              placeholder={t('settings.zoneDescriptionPlaceholder')}
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
    canDelete,
    showLeaveButton,
  };
};

export default ZoneSettings;
