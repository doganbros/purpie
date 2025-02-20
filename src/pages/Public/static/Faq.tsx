import React, { useState } from 'react';
import { Accordion, AccordionPanel, Box } from 'grommet';
import { useTranslation } from 'react-i18next';
import StaticText from './StaticText';
import StaticTitle from './StaticTitle';
import StaticList from './StaticList';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const Faq = (): Menu => {
  const { t } = useTranslation();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const accordion = (
    titleTKey: string,
    textTKey: string | string[],
    listItemTKeys?: string[],
    searchText?: string
  ) => (
    <AccordionPanel
      label={
        <Box pad={{ vertical: 'small' }}>
          <StaticTitle searchText={searchText} tKey={t(titleTKey)} />
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
    key: 'faq',
    label: 'FAQ',
    labelNotVisible: true,
    url: 'faq',
    items: [
      {
        key: 'faq-content',
        label: 'FAQ',
        searchableTexts: [
          t('Faq.q1'),
          t('Faq.q2'),
          t('Faq.q3'),
          t('Faq.q4'),
          t('Faq.q5'),
          t('Faq.q6'),
          t('Faq.q7'),
          t('Faq.q8'),
          t('Faq.q9'),
          t('Faq.q10'),
          t('Faq.q11'),
          t('Faq.q12'),
        ],
        componentFunc: (searchText?: string) => (
          <Box
            border={{ size: 'xsmall', color: 'status-disabled-light' }}
            round="small"
            pad="medium"
          >
            <Accordion
              activeIndex={activeAccordionIndex}
              onActive={(i) => setActiveAccordionIndex(i[0])}
            >
              {accordion('Faq.q1', 'Faq.a1', undefined, searchText)}
              {accordion(
                'Faq.q2',
                'Faq.a2',
                ['Faq.a2ListItem1', 'Faq.a2ListItem2', 'Faq.a2ListItem3'],
                searchText
              )}
              {accordion('Faq.q3', 'Faq.a3', undefined, searchText)}
              {accordion('Faq.q4', 'Faq.a4', undefined, searchText)}
              {accordion('Faq.q5', 'Faq.a5', undefined, searchText)}
              {accordion('Faq.q6', 'Faq.a6', undefined, searchText)}
              {accordion(
                'Faq.q7',
                'Faq.a7',
                [
                  'Faq.a7ListItem1',
                  'Faq.a7ListItem2',
                  'Faq.a7ListItem3',
                  'Faq.a7ListItem4',
                ],
                searchText
              )}
              {accordion('Faq.q8', 'Faq.a8', undefined, searchText)}
              {accordion(
                'Faq.q9',
                'Faq.a9',
                [
                  'Faq.a9ListItem1',
                  'Faq.a9ListItem2',
                  'Faq.a9ListItem3',
                  'Faq.a9ListItem4',
                ],
                searchText
              )}
              {accordion('Faq.q10', 'Faq.a10', undefined, searchText)}
              {accordion('Faq.q11', 'Faq.a11', undefined, searchText)}
              {accordion('Faq.q12', 'Faq.a12', undefined, searchText)}
            </Accordion>
          </Box>
        ),
      },
    ],
  };
};

export default Faq;
