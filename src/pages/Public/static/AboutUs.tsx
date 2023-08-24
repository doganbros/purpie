import React from 'react';
import { Box } from 'grommet';
import { useTranslation } from 'react-i18next';
import StaticText from './StaticText';

const AboutUs: () => any = () => {
  const { t } = useTranslation();
  return {
    id: 0,
    key: 'aboutUs',
    label: t('AboutUs.title'),
    labelNotVisible: true,
    url: 'about-us',
    items: [
      {
        key: 'about-us-content',
        title: t('AboutUs.title'),
        component: (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
            gap="small"
          >
            <StaticText tKey="AboutUs.text1" />
            <StaticText tKey="AboutUs.text2" />
            <StaticText tKey="AboutUs.text3" />
          </Box>
        ),
      },
    ],
  };
};

export default AboutUs;
