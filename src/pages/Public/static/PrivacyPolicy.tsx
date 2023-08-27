import React from 'react';
import { Anchor, Box } from 'grommet';
import { Trans, useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const PrivacyPolicy = (): Menu => {
  const { t } = useTranslation();

  return {
    key: 'privacy-policy',
    label: t('PrivacyPolicy.title'),
    labelNotVisible: true,
    url: 'privacy-policy',
    items: [
      {
        key: 'privacy-policy-content',
        label: t('PrivacyPolicy.title'),
        component: (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
            gap="small"
          >
            <StaticText tKey="PrivacyPolicy.text1" />
            <StaticText tKey="PrivacyPolicy.text2" />
            <StaticText tKey="PrivacyPolicy.text3" />
            <StaticTitle tKey="PrivacyPolicy.title1" />
            <StaticText tKey="PrivacyPolicy.description1" />
            <StaticTitle tKey="PrivacyPolicy.title2" />
            <StaticText tKey="PrivacyPolicy.description2" />
            <StaticTitle tKey="PrivacyPolicy.title3" />
            <StaticText tKey="PrivacyPolicy.description31" />
            <StaticText tKey="PrivacyPolicy.description32" />
            <StaticTitle tKey="PrivacyPolicy.title4" />
            <StaticText tKey="PrivacyPolicy.description41" />
            <StaticList
              tKeys={[
                'PrivacyPolicy.description41ListItem1',
                'PrivacyPolicy.description41ListItem2',
                'PrivacyPolicy.description41ListItem3',
                'PrivacyPolicy.description41ListItem4',
              ]}
            />
            <StaticText tKey="PrivacyPolicy.description42" />
            <StaticTitle tKey="PrivacyPolicy.title5" />
            <StaticText tKey="PrivacyPolicy.description5" />
            <StaticTitle tKey="PrivacyPolicy.title6" />
            <StaticText tKey="PrivacyPolicy.description6" />
            <StaticTitle tKey="PrivacyPolicy.title7" />
            <StaticText tKey="PrivacyPolicy.description7" />
            <StaticTitle tKey="PrivacyPolicy.title8" />
            <StaticText
              tKey={
                <Trans i18nKey="PrivacyPolicy.description8">
                  <Anchor href="https://purpie.org" target="_blank" />
                </Trans>
              }
            />
          </Box>
        ),
      },
    ],
  };
};

export default PrivacyPolicy;
