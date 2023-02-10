import React from 'react';
import { Anchor, Box } from 'grommet';
import { Trans } from 'react-i18next';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';

const TermsAndConditions: () => Menu | null = () => {
  return {
    id: 0,
    key: 'terms-and-conditions',
    label: 'Terms & Conditions',
    labelNotVisible: true,
    url: 'terms-and-conditions',
    items: [
      {
        key: 'terms-and-conditions-content',
        title: 'Terms & Conditions',
        component: (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
            gap="small"
          >
            <StaticText tKey="TermsAndConditions.text1" />
            <StaticText
              tKey={
                <Trans i18nKey="TermsAndConditions.text2">
                  <Anchor href="https://purpie.io" target="_blank" />
                </Trans>
              }
            />
            <StaticText tKey="TermsAndConditions.text3" />
            <StaticText tKey="TermsAndConditions.text4" />
            <StaticTitle tKey="TermsAndConditions.title1" />
            <StaticText tKey="TermsAndConditions.description11" />
            <StaticText tKey="TermsAndConditions.description12" />
            <StaticTitle tKey="TermsAndConditions.title2" />
            <StaticText tKey="TermsAndConditions.description21" />
            <StaticText tKey="TermsAndConditions.description22" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description22ListItem1',
                'TermsAndConditions.description22ListItem2',
                'TermsAndConditions.description22ListItem3',
                'TermsAndConditions.description22ListItem4',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description23" />
            <StaticText tKey="TermsAndConditions.description24" />
            <StaticText tKey="TermsAndConditions.description25" />
            <StaticText tKey="TermsAndConditions.description26" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description26ListItem1',
                'TermsAndConditions.description26ListItem2',
                'TermsAndConditions.description26ListItem3',
                'TermsAndConditions.description26ListItem4',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description27" />
            <StaticTitle tKey="TermsAndConditions.title3" />
            <StaticText tKey="TermsAndConditions.description31" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description31ListItem1',
                'TermsAndConditions.description31ListItem2',
                'TermsAndConditions.description31ListItem3',
                'TermsAndConditions.description31ListItem4',
                'TermsAndConditions.description31ListItem5',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description32" />
            <StaticText tKey="TermsAndConditions.description33" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description33ListItem1',
                'TermsAndConditions.description33ListItem2',
                'TermsAndConditions.description33ListItem3',
                'TermsAndConditions.description33ListItem4',
                'TermsAndConditions.description33ListItem5',
                'TermsAndConditions.description33ListItem6',
                'TermsAndConditions.description33ListItem7',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description34" />
            <StaticText tKey="TermsAndConditions.description35" />
            <StaticText tKey="TermsAndConditions.description36" />
            <StaticText tKey="TermsAndConditions.description37" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description37ListItem1',
                'TermsAndConditions.description37ListItem2',
                'TermsAndConditions.description37ListItem3',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description38" />
            <StaticTitle tKey="TermsAndConditions.title4" />
            <StaticText tKey="TermsAndConditions.description4" />
            <StaticTitle tKey="TermsAndConditions.title5" />
            <StaticText tKey="TermsAndConditions.description5" />
            <StaticTitle tKey="TermsAndConditions.title6" />
            <StaticText tKey="TermsAndConditions.description6" />
            <StaticTitle tKey="TermsAndConditions.title7" />
            <StaticText tKey="TermsAndConditions.description7" />
            <StaticTitle tKey="TermsAndConditions.title8" />
            <StaticText tKey="TermsAndConditions.description81" />
            <StaticText tKey="TermsAndConditions.description82" />
            <StaticTitle tKey="TermsAndConditions.title9" />
            <StaticText tKey="TermsAndConditions.description91" />
            <StaticList
              tKeys={[
                'TermsAndConditions.description91ListItem1',
                'TermsAndConditions.description91ListItem2',
                'TermsAndConditions.description91ListItem3',
                'TermsAndConditions.description91ListItem4',
              ]}
            />
            <StaticText tKey="TermsAndConditions.description92" />
            <StaticText tKey="TermsAndConditions.description93" />
          </Box>
        ),
      },
    ],
  };
};

export default TermsAndConditions;
