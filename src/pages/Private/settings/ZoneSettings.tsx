import React, { useState } from 'react';
import { Box, CheckBox, DropButton, Grid, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { CaretDownFill, CaretRightFill } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import ListButton from '../../../components/utils/ListButton';
import SectionContainer from '../../../components/utils/SectionContainer';
import {
  REACT_APP_API_VERSION,
  REACT_APP_SERVER_HOST,
} from '../../../config/http';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateZonePayload } from '../../../store/types/zone.types';
import { SettingsData } from './types';
import {
  changeZoneInformationAction,
  changeZonePhoto,
} from '../../../store/actions/zone.action';
import AvatarUpload from './AvatarUpload';
import { ZoneAvatar } from '../../../components/Avatars/ZoneAvatar';

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

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>({
    name: '',
    description: '',
    subdomain: '',
    id: userZones?.[0]?.zone?.id || 0,
    public: userZones?.[0]?.zone?.public || false,
  });
  const [zonePermissions, setZonePermissions] = useState({
    canInvite: userZones?.[0]?.zoneRole?.canInvite,
    canDelete: userZones?.[0]?.zoneRole?.canDelete,
    canEdit: userZones?.[0]?.zoneRole?.canEdit,
    canManageRole: userZones?.[0]?.zoneRole?.canManageRole,
    canCreateChannel: userZones?.[0]?.zoneRole?.canDelete,
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

  const zoneId = userZones?.[selectedUserZoneIndex]?.zone?.id;
  return {
    id: 2,
    key: 'zone',
    label: t('settings.zoneSettings'),
    url: 'zone',
    onSave: () => {
      if (!(zoneId === null || zoneId === undefined)) {
        dispatch(changeZoneInformationAction(zoneId, zonePayload));
      }
    },
    avatarWidget: (
      <Box direction="row" gap="small">
        {!showZoneSelector && (
          <ZoneAvatar
            id={1}
            title={userZones?.[selectedUserZoneIndex]?.zone?.name}
            src={
              userZones?.[selectedUserZoneIndex]?.zone?.displayPhoto
                ? `${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}/zone/display-photo/${userZones?.[selectedUserZoneIndex].zone.displayPhoto}`
                : undefined
            }
            onClickEdit={() => setShowAvatarUpload(true)}
            outerCircle
            editAvatar
          />
        )}
        <DropButton
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
                  }}
                  leftIcon={
                    <ZoneAvatar
                      id={Math.floor(Math.random() * 100)}
                      title={item.zone.name}
                      src={
                        item.zone.displayPhoto
                          ? `${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}/zone/display-photo/${item.zone.displayPhoto}`
                          : undefined
                      }
                      onClickEdit={() => setShowAvatarUpload(true)}
                      outerCircle
                    />
                  }
                />
              ))}
            </Box>
          }
        >
          {!showZoneSelector ? (
            <Box direction="row">
              <Box>
                <Text>{userZones?.[selectedUserZoneIndex]?.zone?.name}</Text>
                <Text color="#8F9BB3">
                  {userZones?.[selectedUserZoneIndex]?.zone?.subdomain}
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
              <Text>{t('settings.selectZone')}</Text>
              <CaretRightFill color="brand" />{' '}
            </Box>
          )}
        </DropButton>
        {showAvatarUpload && !(zoneId === null) && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(changeZonePhoto(file, zoneId || 1));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
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

      {
        key: 'zoneManageRole',
        title: t('settings.permissions'),
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="User Permissions">
            <Grid
              rows={['xxsmall', 'xxsmall', 'xxsmall']}
              columns={['medium', 'medium']}
              gap="small"
            >
              <Box
                align="center"
                direction="row"
                gap="xsmall"
                justify="between"
                onClick={() =>
                  setZonePermissions({
                    ...zonePermissions,
                    canManageRole: !zonePermissions.canManageRole,
                  })
                }
              >
                <Text>{t('settings.canManageRole')}</Text>
                <CheckBox checked={zonePermissions.canManageRole} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                onClick={() =>
                  setZonePermissions({
                    ...zonePermissions,
                    canEdit: !zonePermissions.canEdit,
                  })
                }
              >
                <Text>{t('settings.canEdit')}</Text>
                <CheckBox checked={zonePermissions.canEdit} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                onClick={() =>
                  setZonePermissions({
                    ...zonePermissions,
                    canDelete: !zonePermissions.canDelete,
                  })
                }
              >
                <Text>{t('settings.canDelete')}</Text>
                <CheckBox checked={zonePermissions.canDelete} />
              </Box>

              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                onClick={() =>
                  setZonePermissions({
                    ...zonePermissions,
                    canInvite: !zonePermissions.canInvite,
                  })
                }
              >
                <Text>{t('settings.canInvite')}</Text>
                <CheckBox checked={zonePermissions.canInvite} />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                onClick={() =>
                  setZonePermissions({
                    ...zonePermissions,
                    canCreateChannel: !zonePermissions.canCreateChannel,
                  })
                }
              >
                <Text>{t('settings.canCreateChannel')}</Text>
                <CheckBox checked={zonePermissions.canCreateChannel} />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
      {
        key: 'zonePublic',
        title: '',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label={t('settings.zoneVisibility')}>
            <Grid rows={['xxsmall']} columns={['medium', 'medium']} gap="small">
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
                onClick={() =>
                  setZonePayload({
                    ...zonePayload,
                    public: !zonePayload.public,
                  })
                }
              >
                <Text>{t('settings.public')}</Text>
                <CheckBox checked={zonePayload.public} />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
    ],
    isEmpty: showZoneSelector,
  };
};

export default ZoneSettings;
