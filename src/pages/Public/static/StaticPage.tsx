import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useTitle } from '../../../hooks/useTitle';
import SettingsAndStaticPageLayout from '../../../components/layouts/SettingsAndStaticPageLayout/SettingsAndStaticPageLayout';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import Faq from './Faq';

const StaticPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('settings.documentTitle'));

  const data: Menu[] = [
    AboutUs(),
    PrivacyPolicy(),
    TermsAndConditions(),
    Faq(),
  ].filter((v): v is Menu => v !== null);

  return <SettingsAndStaticPageLayout pageTitle="Support" menuList={data} />;
};

export default StaticPage;
