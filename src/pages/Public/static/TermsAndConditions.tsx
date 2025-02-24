import React from 'react';
import { Box } from 'grommet';
import { useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const TermsAndConditions = (): Menu => {
  const { t } = useTranslation();

  const items = [
    {
      text: t('TermsAndConditions.acceptanceOfTerms'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.acceptanceDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.decentralizedNature'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.decentralizedDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.noCentralAuthority'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.contentStored'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.noAbilityToModify'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.userResponsibilities'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.userResponsibilitiesDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.responsibleForContent'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.complianceWithLaws'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.respectPrivacy'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.safeguardKeys'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.lossOfKeys'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.prohibitedActivities'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.prohibitedDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.illegalContent'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.hateSpeech'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.maliciousActivities'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.spamManipulation'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.violationOfIP'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.violationsResult'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.contentOwnership'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.ownershipDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.licenseGrant'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.contentRemoval'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.noWarranties'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.noWarrantiesDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.platformUptime'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.protectionFromLoss'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.recoveryOfContent'),
      type: 3,
    },
    {
      text: t('TermsAndConditions.limitationOfLiability'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.governanceChanges'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.governanceDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.updatesToTerms'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.reviewUpdates'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.terminationEnforcement'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.enforcementDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.violationsSubject'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.thirdPartyServices'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.thirdPartyDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.thirdPartyResponsibility'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.contactSupport'),
      type: 2,
    },
    {
      text: t('TermsAndConditions.supportDescription'),
      type: 1,
    },
    {
      text: t('TermsAndConditions.continuedUse'),
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
        searchableTexts: items.map((item) => item.text),
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
