import React, { useContext, useState } from 'react';
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
import { AppState } from '../../../store/reducers/root.reducer';
import {
  UpdateZonePayload,
  UserZoneListItem,
} from '../../../store/types/zone.types';
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
import ZonePermissions from '../../../layers/settings-and-static-pages/permissions/ZonePermissions';

const ZoneSettings: () => Menu | null = () => {
  const {
    auth: { user },
    zone: {
      selectedUserZone,
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);

  const [selectedZone, setSelectedZone] = useState<UserZoneListItem | null>(
    null
  );
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

  const isFormInitialState =
    zonePayload.name === selectedZone?.zone.name &&
    zonePayload.description === selectedZone?.zone.description &&
    zonePayload.subdomain === selectedZone?.zone.subdomain &&
    zonePayload.public === selectedZone?.zone.public;

  const result = {
    id: 2,
    key: 'zone',
    label: t('settings.zoneSettings'),
    url: 'zone',
    saveButton: (
      <Button
        disabled={isFormInitialState}
        onClick={() =>
          dispatch(updateZoneInfoAction(selectedZone!.zone.id, zonePayload))
        }
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
    deletePopup: showDeletePopup && (
      <ConfirmDialog
        message={`${t('settings.deleteMessage')} \n ${
          selectedZone?.zone.name
        } zone?`}
        onConfirm={() => {
          dispatch(
            deleteZoneAction(
              selectedZone!.zone.id,
              selectedZone?.zone.id === selectedUserZone?.zone.id
            )
          );

          setShowDeletePopup(false);
        }}
        onDismiss={() => setShowDeletePopup(false)}
        textProps={{ wordBreak: 'break-word' }}
      />
    ),
    leaveButton: (
      <Button
        onClick={() => setShowLeavePopup(true)}
        secondary
        color="red"
        label={t('common.leave')}
        margin={{ vertical: 'medium' }}
      />
    ),
    leavePopup: showLeavePopup && (
      <ConfirmDialog
        message={`${t('settings.zoneLeaveMessage')}\n${
          selectedZone!.zone.name
        } zone?`}
        onConfirm={() => {
          dispatch(leaveZoneAction(selectedZone!.id!));
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
                id={selectedZone!.zone.id}
                name={selectedZone!.zone.name}
                src={selectedZone!.zone.displayPhoto}
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
          dropAlign={
            size === 'small'
              ? { left: 'left', top: 'bottom' }
              : { left: 'right', top: 'top' }
          }
          dropContent={
            <Box width={{ min: '250px' }} overflow="auto">
              {userZones?.map((item) => (
                <ListButton
                  label={item.zone.name}
                  subLabel={t(`Permissions.${item.zoneRole.roleCode}`)}
                  key={item.zone.id}
                  onClick={() => {
                    setZonePayload({
                      name: item.zone.name,
                      id: item.zone.id,
                      subdomain: item.zone.subdomain,
                      public: item.zone.public,
                      description: item.zone.description,
                    });
                    setSelectedZone(item);
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
                <Text>{selectedZone?.zone.name}</Text>
                <Text color="status-disabled">
                  {user?.id === selectedZone?.zone.createdBy?.id
                    ? t('settings.owner')
                    : t('settings.member')}
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
              <CaretRightFill color="brand" />{' '}
            </Box>
          )}
        </DropButton>
        {showAvatarUpload && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(updateZonePhotoAction(file, selectedZone!.id!));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
            type="zone"
            src={selectedZone?.zone.displayPhoto}
            id={selectedZone?.zone.id}
            name={selectedZone?.zone.name}
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
    canDelete: selectedZone?.zoneRole.canDelete,
    showLeaveButton: user?.id !== selectedZone?.zone.createdBy?.id,
  };

  if (selectedZone && selectedZone.zoneRole.canManageRole)
    result.items.push({
      key: 'zonePermissions',
      title: '',
      value: 'value',
      component: <ZonePermissions userZone={selectedZone} />,
    });
  return result;
};

export default ZoneSettings;
