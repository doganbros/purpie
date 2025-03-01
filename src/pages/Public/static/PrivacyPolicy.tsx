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
    { text: 'PrivacyPolicy.welcomeText', type: 1 },
    { text: 'PrivacyPolicy.introduction', type: 2 },
    { text: 'PrivacyPolicy.introductionText', type: 1 },

    { text: 'PrivacyPolicy.informationWeCollect', type: 2 },
    { text: 'PrivacyPolicy.informationWeCollectText', type: 1 },

    { text: 'PrivacyPolicy.informationYouProvide', type: 2 },
    { text: 'PrivacyPolicy.informationYouProvideText1', type: 1 },
    { text: 'PrivacyPolicy.informationYouProvideText2', type: 1 },

    { text: 'PrivacyPolicy.informationCollectedAutomatically', type: 2 },
    { text: 'PrivacyPolicy.informationCollectedAutomaticallyText1', type: 1 },
    { text: 'PrivacyPolicy.informationCollectedAutomaticallyText2', type: 1 },
    { text: 'PrivacyPolicy.informationCollectedAutomaticallyText3', type: 1 },

    { text: 'PrivacyPolicy.thirdPartyIntegrations', type: 2 },
    { text: 'PrivacyPolicy.thirdPartyIntegrationsText', type: 1 },

    { text: 'PrivacyPolicy.howYourInformationIsUsed', type: 2 },
    { text: 'PrivacyPolicy.howYourInformationIsUsedText', type: 1 },
    { text: 'PrivacyPolicy.howYourInformationIsUsedListItem1', type: 4 },
    { text: 'PrivacyPolicy.howYourInformationIsUsedListItem2', type: 4 },
    { text: 'PrivacyPolicy.howYourInformationIsUsedListItem3', type: 4 },

    { text: 'PrivacyPolicy.dataOwnershipAndControl', type: 2 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlText1', type: 1 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlListItem1', type: 5 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlListItem2', type: 5 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlListItem3', type: 5 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlText2', type: 1 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlListItem4', type: 6 },
    { text: 'PrivacyPolicy.dataOwnershipAndControlListItem5', type: 6 },

    { text: 'PrivacyPolicy.securityMeasures', type: 2 },
    { text: 'PrivacyPolicy.securityMeasuresText', type: 1 },
    { text: 'PrivacyPolicy.securityMeasuresListItem1', type: 7 },
    { text: 'PrivacyPolicy.securityMeasuresListItem2', type: 7 },
    { text: 'PrivacyPolicy.securityMeasuresListItem3', type: 7 },

    { text: 'PrivacyPolicy.thirdPartyServices', type: 2 },
    { text: 'PrivacyPolicy.thirdPartyServicesText', type: 1 },

    { text: 'PrivacyPolicy.childrensPrivacy', type: 2 },
    { text: 'PrivacyPolicy.childrensPrivacyText', type: 1 },

    { text: 'PrivacyPolicy.changesToThisPolicy', type: 2 },
    { text: 'PrivacyPolicy.changesToThisPolicyText', type: 1 },

    { text: 'PrivacyPolicy.contactAndQuestions', type: 2 },
    {
      text: (
        <Trans i18nKey="PrivacyPolicy.contactAndQuestionsText">
          <Anchor href="https://purpie.org" target="_blank" />
        </Trans>
      ),
      type: 1,
    },

    { text: 'PrivacyPolicy.conclusion', type: 1 },
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
                if ([3, 4, 5, 6, 7, 8, 9].includes(item.type)) {
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
