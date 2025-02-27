import React from 'react';
import { Box, Text, Anchor } from 'grommet';
import { useTranslation, Trans } from 'react-i18next';

import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const AboutUs = (): Menu => {
  const { t } = useTranslation();

  const items = [
    {
      text: 'AboutUs.introduction',
      type: 1,
    },
    {
      text: 'AboutUs.vision',
      type: 2,
    },
    {
      text: 'AboutUs.visionText',
      type: 1,
    },
    {
      text: 'AboutUs.keyFeatures',
      type: 2,
    },
    {
      text: 'AboutUs.fairCompensation',
      type: 3,
    },
    {
      text: 'AboutUs.transparentAlgorithms',
      type: 3,
    },
    {
      text: 'AboutUs.contentOwnership',
      type: 3,
    },
    {
      text: 'AboutUs.flexibleMonetization',
      type: 3,
    },
    {
      text: 'AboutUs.decentralizedGovernance',
      type: 3,
    },
    {
      text: 'AboutUs.advancedCreationTools',
      type: 3,
    },
    {
      text: 'AboutUs.communitySupport',
      type: 3,
    },
    {
      text: 'AboutUs.openSourceCommitment',
      type: 2,
    },
    {
      text: 'AboutUs.openSourceText',
      type: 1,
    },
    {
      text: 'AboutUs.tokenomicsAndRoadmap',
      type: 2,
    },
    {
      text: 'AboutUs.tokenomicsText',
      type: 4,
    },
    {
      text: 'AboutUs.joinUs',
      type: 2,
    },
    {
      text: 'AboutUs.joinUsText',
      type: 4,
    },
  ];

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
            {items.map((item) => {
              if (item.type === 1) {
                return (
                  <StaticText
                    key={item.text}
                    tKey={item.text}
                    searchText={search}
                  />
                );
              }
              if (item.type === 2) {
                return (
                  <StaticTitle
                    key={item.text}
                    tKey={item.text}
                    searchText={search}
                  />
                );
              }
              if (item.type === 3) {
                const keyFeatureItems = items
                  .filter((i) => i.type === 3)
                  .map((i) => i.text);

                if (item.text === keyFeatureItems[0]) {
                  return (
                    <Box key="key-features-list">
                      <StaticList tKeys={keyFeatureItems} searchText={search} />
                    </Box>
                  );
                }
                return null;
              }
              if (item.type === 4) {
                if (item.text === 'AboutUs.tokenomicsText') {
                  return (
                    <Box key={item.text}>
                      <Text color="dark" size="small" weight="normal">
                        <Trans
                          i18nKey={item.text}
                          components={[
                            <Anchor
                              key={item.text}
                              href="https://pavilion.network/whitepaper-1.16.pdf"
                              target="_blank"
                            />,
                          ]}
                        />
                      </Text>
                    </Box>
                  );
                }
                if (item.text === 'AboutUs.joinUsText') {
                  return (
                    <Box key={item.text}>
                      <Text color="dark" size="small" weight="normal">
                        <Trans
                          i18nKey={item.text}
                          components={[
                            <Anchor
                              key={item.text}
                              href="https://app.pavilion.network/join"
                              target="_blank"
                            />,
                          ]}
                        />
                      </Text>
                    </Box>
                  );
                }
              }
              return null;
            })}
          </Box>
        ),
        searchableTexts: items.map((item) => t(item.text)),
      },
    ],
  };
};

export default AboutUs;
