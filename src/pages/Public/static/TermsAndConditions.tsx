import React from 'react';
import { Anchor, Box } from 'grommet';
import { Trans, useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const TermsAndConditions = (): Menu => {
  const { t } = useTranslation();

  const items = [
    {
      text: 'TermsAndConditions.text1',
      type: 1,
    },
    {
      text: (
        <Trans i18nKey="TermsAndConditions.text2">
          <Anchor href="https://app.pavilion.network" target="_blank" />
        </Trans>
      ),
      type: 1,
    },
    {
      text: 'TermsAndConditions.text3',
      type: 1,
    },
    {
      text: 'TermsAndConditions.text4',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title1',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description11',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description12',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title2',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description21',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description22',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description22ListItem1',
      type: 3,
    },
    {
      text: 'TermsAndConditions.description22ListItem2',
      type: 3,
    },
    {
      text: 'TermsAndConditions.description22ListItem3',
      type: 3,
    },
    {
      text: 'TermsAndConditions.description22ListItem4',
      type: 3,
    },
    {
      text: 'TermsAndConditions.description23',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description24',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description25',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description26',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description26ListItem1',
      type: 4,
    },
    {
      text: 'TermsAndConditions.description26ListItem2',
      type: 4,
    },
    {
      text: 'TermsAndConditions.description26ListItem3',
      type: 4,
    },
    {
      text: 'TermsAndConditions.description26ListItem4',
      type: 4,
    },
    {
      text: 'TermsAndConditions.description27',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title3',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description31',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description31ListItem1',
      type: 5,
    },
    {
      text: 'TermsAndConditions.description31ListItem2',
      type: 5,
    },
    {
      text: 'TermsAndConditions.description31ListItem3',
      type: 5,
    },
    {
      text: 'TermsAndConditions.description31ListItem4',
      type: 5,
    },
    {
      text: 'TermsAndConditions.description31ListItem5',
      type: 5,
    },
    {
      text: 'TermsAndConditions.description32',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description33',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description33ListItem1',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem2',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem3',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem4',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem5',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem6',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description33ListItem7',
      type: 6,
    },
    {
      text: 'TermsAndConditions.description34',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description35',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description36',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description37',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description37ListItem1',
      type: 7,
    },
    {
      text: 'TermsAndConditions.description37ListItem2',
      type: 7,
    },
    {
      text: 'TermsAndConditions.description37ListItem3',
      type: 7,
    },
    {
      text: 'TermsAndConditions.description38',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title4',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description4',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title5',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description5',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title6',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description6',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title7',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description7',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title8',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description81',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description82',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title9',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description91',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description91ListItem1',
      type: 8,
    },
    {
      text: 'TermsAndConditions.description91ListItem2',
      type: 8,
    },
    {
      text: 'TermsAndConditions.description91ListItem3',
      type: 8,
    },
    {
      text: 'TermsAndConditions.description91ListItem4',
      type: 8,
    },
    {
      text: 'TermsAndConditions.description92',
      type: 1,
    },
    {
      text: 'TermsAndConditions.description93',
      type: 1,
    },
    {
      text: 'TermsAndConditions.title10',
      type: 2,
    },
    {
      text: 'TermsAndConditions.description10',
      type: 1,
    },
  ];

  let listItems: string[] = [];

  return {
    key: 'terms-and-conditions',
    label: 'Terms & Conditions',
    labelNotVisible: true,
    url: 'terms-and-conditions',
    items: [
      {
        key: 'terms-and-conditions-content',
        label: 'Terms & Conditions',
        searchableTexts: items.map((item) => t(item.text as string)),
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
                if ([3, 4, 5, 6, 7, 8, 9].includes(item.type)) {
                  listItems.push(item.text as string);
                }
                return null;
              })
              .filter((item) => item)}
          </Box>
        ),
      },
    ],
  };
};

export default TermsAndConditions;
