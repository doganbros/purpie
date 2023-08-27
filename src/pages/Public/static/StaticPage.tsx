import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useTitle } from '../../../hooks/useTitle';
import SettingsAndStaticPageLayout from '../../../components/layouts/SettingsAndStaticPageLayout/SettingsAndStaticPageLayout';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import AboutUs from './AboutUs';
import PrivacyPolicy from './PrivacyPolicy';
import TermsAndConditions from './TermsAndConditions';
import Faq from './Faq';

interface Params {
  page: string;
}

const StaticPage: FC = () => {
  const { t } = useTranslation();
  useTitle(t('StaticPage.title'));
  const { page } = useParams<Params>();

  const data: Menu[] = [
    AboutUs(),
    PrivacyPolicy(),
    TermsAndConditions(),
    Faq(),
  ];

  return (
    <SettingsAndStaticPageLayout
      pageTitle={t('StaticPage.support')}
      menuList={data}
      pageUrl={page}
    />
  );
};

export default StaticPage;
