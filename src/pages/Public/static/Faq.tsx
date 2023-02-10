import React, { useState } from 'react';
import { Accordion, AccordionPanel, Anchor, Box } from 'grommet';
import { Trans, useTranslation } from 'react-i18next';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';

const Faq: () => Menu | null = () => {
  const { t } = useTranslation();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const accordion = (
    titleTKey: string,
    textTKey: string | string[],
    listItemTKeys?: string[]
  ) => (
    <AccordionPanel
      label={
        <Box pad={{ vertical: 'small' }}>
          <StaticTitle tKey={t(titleTKey)} />
        </Box>
      }
      key={titleTKey}
    >
      <Box gap="small" pad={{ vertical: 'small' }}>
        {typeof textTKey === 'string' ? (
          <StaticText tKey={textTKey} />
        ) : (
          textTKey.map((key) => <StaticText key={key} tKey={key} />)
        )}

        {listItemTKeys && <StaticList tKeys={listItemTKeys} />}
      </Box>
    </AccordionPanel>
  );
  return {
    id: 0,
    key: 'faq',
    label: 'FAQ',
    labelNotVisible: true,
    url: 'faq',
    items: [
      {
        key: 'faq-content',
        title: 'Faq',
        component: (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
          >
            <Accordion
              activeIndex={activeAccordionIndex}
              onActive={(i) => setActiveAccordionIndex(i[0])}
            >
              {accordion('Faq.q1', 'Faq.a1', [
                'Faq.a1ListItem1',
                'Faq.a1ListItem2',
                'Faq.a1ListItem3',
                'Faq.a1ListItem4',
                'Faq.a1ListItem5',
                'Faq.a1ListItem6',
              ])}
              {accordion('Faq.q2', 'Faq.a2', [
                'Faq.a2ListItem1',
                'Faq.a2ListItem2',
                'Faq.a2ListItem3',
                'Faq.a2ListItem4',
                'Faq.a2ListItem5',
                'Faq.a2ListItem6',
              ])}
              {accordion('Faq.q3', 'Faq.a3')}
              {accordion('Faq.q4', ['Faq.a41', 'Faq.a42'])}
              {accordion('Faq.q5', 'Faq.a5')}
              {accordion('Faq.q6', 'Faq.a6')}
              <AccordionPanel
                label={
                  <Box pad={{ vertical: 'small' }}>
                    <StaticTitle tKey={t('Faq.q7')} />
                  </Box>
                }
                key="Faq.q7"
              >
                <Box gap="small" pad={{ vertical: 'small' }}>
                  <StaticText
                    tKey={
                      <Trans i18nKey="Faq.a7">
                        <Anchor
                          href="https://community.purpie.org/"
                          target="_blank"
                        />
                        <Anchor href="https://purpie.org" target="_blank" />
                      </Trans>
                    }
                  />
                </Box>
              </AccordionPanel>
            </Accordion>
          </Box>
        ),
      },
    ],
  };
};

export default Faq;
