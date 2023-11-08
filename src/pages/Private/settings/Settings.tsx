import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import ChannelSettings from './ChannelSettings';
import ZoneSettings from './ZoneSettings';
import { useTitle } from '../../../hooks/useTitle';
import SettingsAndStaticPageLayout from '../../../components/layouts/SettingsAndStaticPageLayout/SettingsAndStaticPageLayout';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import ApiManagement from './MemberShip/ApiManagement/ApiManagement';
import MembershipSettings from './MembershipSettings';
import PasswordSettings from './PasswordSettings';
import PersonalSettings from './PersonalSettings';

const Settings: FC = () => {
  const { t } = useTranslation();
  useTitle(t('settings.documentTitle'));

  const data: Menu[] = [
    PersonalSettings(),
    PasswordSettings(),
    ChannelSettings(),
    ZoneSettings(),
    // MembershipSettings(),
    ApiManagement(),
  ].filter((v): v is Menu => v !== null);

  if (process.env.NODE_ENV !== 'development') data.push(MembershipSettings());
  return (
    <SettingsAndStaticPageLayout
      pageTitle={t('settings.settings')}
      menuList={data}
    />
  );
};

export default Settings;
