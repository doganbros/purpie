import React, { useEffect, useState } from 'react';
import { Box, Text, TextInput } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  UpdateZonePayload,
  UserZoneListItem,
} from '../../../store/types/zone.types';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import ZonePermissions from '../../../layers/settings-and-static-pages/zone/ZonePermissions';
import ZoneUsers from '../../../layers/settings-and-static-pages/zone/ZoneUsers';
import ZoneSettingsHeader from '../../../layers/settings-and-static-pages/zone/ZoneSettingsHeader';
import ZoneSettingsActions from '../../../layers/settings-and-static-pages/zone/ZoneSettingsActions';

const initialZonePayload = {
  name: '',
  description: '',
  subdomain: '',
  id: '',
  public: false,
};

const ZoneSettings = (): Menu => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  const [selectedZone, setSelectedZone] = useState<UserZoneListItem | null>(
    null
  );

  const { t } = useTranslation();

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>(
    initialZonePayload
  );

  useEffect(() => {
    if (selectedZone)
      setZonePayload({
        name: selectedZone.zone.name,
        id: selectedZone.zone.id,
        subdomain: selectedZone.zone.subdomain,
        public: selectedZone.zone.public,
        description: selectedZone.zone.description,
      });
    else setZonePayload(initialZonePayload);
  }, [selectedZone]);

  const zoneSettings: Menu = {
    key: 'zone',
    label: t('settings.zoneSettings'),
    url: 'zone',
  };

  if (userZones?.length === 0) {
    zoneSettings.items = [
      {
        key: 'noZone',
        label: '',
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
    ];
    return zoneSettings;
  }

  zoneSettings.header = (
    <ZoneSettingsHeader
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
    />
  );
  zoneSettings.action = (
    <ZoneSettingsActions
      selectedZone={selectedZone}
      setSelectedZone={setSelectedZone}
      zonePayload={zonePayload}
    />
  );
  zoneSettings.tabs = [{ index: 1, label: t('settings.general') }];
  zoneSettings.items = [
    {
      key: 'zoneName',
      label: t('settings.zoneName'),
      tabIndex: 1,
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
            disabled={!selectedZone?.zoneRole.canEdit}
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
      label: t('settings.zoneSubdomain'),
      tabIndex: 1,
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
            disabled={!selectedZone?.zoneRole.canEdit}
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
      label: t('settings.zoneDescription'),
      tabIndex: 1,
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
            disabled={!selectedZone?.zoneRole.canEdit}
            placeholder={t('settings.zoneDescriptionPlaceholder')}
            value={zonePayload.description || ''}
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
  ];

  if (selectedZone?.zoneRole.canManageRole) {
    zoneSettings.tabs.push({ index: 2, label: t('settings.permissions') });
    zoneSettings.items.push({
      key: 'zonePermissions',
      label: '',
      tabIndex: 2,
      componentFunc: (search?: string) => (
        <ZonePermissions userZone={selectedZone} searchText={search} />
      ),
      searchableTexts: [
        t('ZonePermissionAction.canCreateChannel'),
        t('ZonePermissionAction.canInvite'),
        t('ZonePermissionAction.canDelete'),
        t('ZonePermissionAction.canEdit'),
        t('ZonePermissionAction.canManageRole'),
      ],
    });
    zoneSettings.tabs.push({ index: 3, label: t('settings.members') });
    zoneSettings.items.push({
      key: 'zoneMembers',
      label: '',
      tabIndex: 3,
      component: <ZoneUsers zoneId={selectedZone.zone.id} />,
    });
  }
  return zoneSettings;
};

export default ZoneSettings;
