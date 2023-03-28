import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ChannelSettings from './ChannelSettings';
import PersonalSettings from './PersonalSettings';
import ZoneSettings from './ZoneSettings';
import { useTitle } from '../../../hooks/useTitle';
import SettingsAndStaticPageLayout from '../../../components/layouts/SettingsAndStaticPageLayout/SettingsAndStaticPageLayout';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import PermissionSettings from './PermissionSettings';

const Settings: FC = () => {
  const { t } = useTranslation();
  useTitle(t('settings.documentTitle'));

  const data: Menu[] = [
    PersonalSettings(),
    ChannelSettings(),
    ZoneSettings(),
    PermissionSettings(),
  ].filter((v): v is Menu => v !== null);

  return (
    <SettingsAndStaticPageLayout
      pageTitle={t('settings.settings')}
      menuList={data}
    />
  );
};

export default Settings;
