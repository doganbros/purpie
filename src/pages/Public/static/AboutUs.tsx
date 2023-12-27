import React from 'react';
import { Box } from 'grommet';
import { useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const AboutUs = (): Menu => {
  const { t } = useTranslation();
  return {
    key: 'aboutUs',
    label: t('AboutUs.title'),
    labelNotVisible: true,
    url: 'about-us',
    items: [
      {
        key: 'about-us-content',
        label: t('AboutUs.title'),
        componentFunc: (search?: string) => (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
            gap="small"
          >
            <StaticText tKey="AboutUs.text1" searchText={search} />
            <StaticText tKey="AboutUs.text2" searchText={search} />
            <StaticText tKey="AboutUs.text3" searchText={search} />
          </Box>
        ),
        searchableTexts: [
          t('AboutUs.text1'),
          t('AboutUs.text2'),
          t('AboutUs.text3'),
        ],
      },
    ],
  };
};

export default AboutUs;
