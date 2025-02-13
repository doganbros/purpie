import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ChannelSettings from './ChannelSettings';
import ZoneSettings from './ZoneSettings';
import { useTitle } from '../../../hooks/useTitle';
import SettingsAndStaticPageLayout from '../../../components/layouts/SettingsAndStaticPageLayout/SettingsAndStaticPageLayout';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import ApiManagement from './MemberShip/ApiManagement/ApiManagement';
import MembershipSettings from './MembershipSettings';
import PasswordSettings from './PasswordSettings';
import PersonalSettings from './PersonalSettings';

interface Params {
  page: string;
}

const Settings: FC = () => {
  const { t } = useTranslation();
  useTitle(t('settings.documentTitle'));
  const { page } = useParams<Params>();

  const data: Menu[] = [
    PersonalSettings(),
    PasswordSettings(),
    ChannelSettings(),
    ZoneSettings(),
    ApiManagement(),
  ].filter((v): v is Menu => v !== null);

  if (process.env.NODE_ENV !== 'development') data.push(MembershipSettings());
  return (
    <SettingsAndStaticPageLayout
      pageTitle={t('settings.settings')}
      menuList={data}
      pageUrl={page}
    />
  );
};

export default Settings;
