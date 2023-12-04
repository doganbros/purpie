import React from 'react';
import { Anchor, Box } from 'grommet';
import { Trans, useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const PrivacyPolicy = (): Menu => {
  const { t } = useTranslation();

  const items = [
    { text: 'PrivacyPolicy.text1', type: 1 },
    { text: 'PrivacyPolicy.text2', type: 1 },
    { text: 'PrivacyPolicy.text3', type: 1 },
    { text: 'PrivacyPolicy.title1', type: 2 },
    { text: 'PrivacyPolicy.description1', type: 1 },
    { text: 'PrivacyPolicy.title2', type: 2 },
    { text: 'PrivacyPolicy.description2', type: 1 },
    { text: 'PrivacyPolicy.title3', type: 2 },
    { text: 'PrivacyPolicy.description31', type: 1 },
    { text: 'PrivacyPolicy.description32', type: 1 },
    { text: 'PrivacyPolicy.title4', type: 2 },
    { text: 'PrivacyPolicy.description41', type: 1 },
    { text: 'PrivacyPolicy.description41ListItem1', type: 3 },
    { text: 'PrivacyPolicy.description41ListItem2', type: 3 },
    { text: 'PrivacyPolicy.description41ListItem3', type: 3 },
    { text: 'PrivacyPolicy.description41ListItem4', type: 3 },
    { text: 'PrivacyPolicy.description42', type: 1 },
    { text: 'PrivacyPolicy.title5', type: 2 },
    { text: 'PrivacyPolicy.description5', type: 1 },
    { text: 'PrivacyPolicy.title6', type: 2 },
    { text: 'PrivacyPolicy.description6', type: 1 },
    { text: 'PrivacyPolicy.title7', type: 2 },
    { text: 'PrivacyPolicy.description7', type: 1 },
    { text: 'PrivacyPolicy.title8', type: 2 },
    {
      text: (
        <Trans i18nKey="PrivacyPolicy.description8">
          <Anchor href="https://purpie.org" target="_blank" />
        </Trans>
      ),
      type: 1,
    },
  ];

  let listItems: string[] = [];
  return {
    key: 'privacy-policy',
    label: t('PrivacyPolicy.title'),
    labelNotVisible: true,
    url: 'privacy-policy',
    items: [
      {
        key: 'privacy-policy-content',
        label: t('PrivacyPolicy.title'),
        componentFunc: (search?: string) => (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
            gap="small"
          >
            {items
              .map((item) => {
                if (item.type === 1) {
                  if (listItems.length > 0) {
                    const list = (
                      <StaticList tKeys={listItems} searchText={search} />
                    );
                    listItems = [];
                    return (
                      <>
                        {list}
                        <StaticText tKey={item.text} searchText={search} />
                      </>
                    );
                  }
                  return <StaticText tKey={item.text} searchText={search} />;
                }
                if (item.type === 2) {
                  if (listItems.length > 0) {
                    const list = (
                      <StaticList tKeys={listItems} searchText={search} />
                    );
                    listItems = [];
                    return (
                      <>
                        {list}
                        <StaticTitle
                          tKey={item.text as string}
                          searchText={search}
                        />
                      </>
                    );
                  }

                  return (
                    <StaticTitle
                      tKey={item.text as string}
                      searchText={search}
                    />
                  );
                }
                if (item.type === 3) {
                  listItems.push(item.text as string);
                }
                return null;
              })
              .filter((item) => item)}
          </Box>
        ),
        searchableTexts: items.map((i) => t(i.text as string)),
      },
    ],
  };
};

export default PrivacyPolicy;
