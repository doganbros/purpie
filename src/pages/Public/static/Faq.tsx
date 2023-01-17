import React, { useState } from 'react';
import { Accordion, AccordionPanel, Box, Text } from 'grommet';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const Faq: () => Menu | null = () => {
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

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
              <AccordionPanel label="Lorem ipsum dolor sit amet" key={1}>
                <Box pad={{ vertical: 'small' }}>
                  <Text color="dark" size="medium" weight="normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Orci ac auctor augue mauris augue. Nec dui nunc
                    mattis enim ut tellus. Scelerisque purus semper eget duis at
                    tellus at urna condimentum. Mauris pharetra et ultrices
                    neque ornare aenean euismod. In egestas erat imperdiet sed
                    euismod. Pellentesque sit amet porttitor eget. Egestas quis
                    ipsum suspendisse ultrices gravida dictum. Eget gravida cum
                    sociis natoque penatibus et magnis dis. Ac felis donec et
                    odio pellentesque. Ac ut consequat semper viverra nam libero
                    justo laoreet.
                  </Text>
                </Box>
              </AccordionPanel>
              <AccordionPanel label="Lorem ipsum dolor sit amet" key={2}>
                <Box pad={{ vertical: 'small' }}>
                  <Text color="dark" size="medium" weight="normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Orci ac auctor augue mauris augue. Nec dui nunc
                    mattis enim ut tellus. Scelerisque purus semper eget duis at
                    tellus at urna condimentum. Mauris pharetra et ultrices
                    neque ornare aenean euismod. In egestas erat imperdiet sed
                    euismod. Pellentesque sit amet porttitor eget. Egestas quis
                    ipsum suspendisse ultrices gravida dictum. Eget gravida cum
                    sociis natoque penatibus et magnis dis. Ac felis donec et
                    odio pellentesque. Ac ut consequat semper viverra nam libero
                    justo laoreet.
                  </Text>
                </Box>
              </AccordionPanel>
              <AccordionPanel label="Lorem ipsum dolor sit amet" key={3}>
                <Box pad={{ vertical: 'small' }}>
                  <Text color="dark" size="medium" weight="normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Orci ac auctor augue mauris augue. Nec dui nunc
                    mattis enim ut tellus. Scelerisque purus semper eget duis at
                    tellus at urna condimentum. Mauris pharetra et ultrices
                    neque ornare aenean euismod. In egestas erat imperdiet sed
                    euismod. Pellentesque sit amet porttitor eget. Egestas quis
                    ipsum suspendisse ultrices gravida dictum. Eget gravida cum
                    sociis natoque penatibus et magnis dis. Ac felis donec et
                    odio pellentesque. Ac ut consequat semper viverra nam libero
                    justo laoreet.
                  </Text>
                </Box>
              </AccordionPanel>
              <AccordionPanel label="Lorem ipsum dolor sit amet" key={4}>
                <Box pad={{ vertical: 'small' }}>
                  <Text color="dark" size="medium" weight="normal">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Orci ac auctor augue mauris augue. Nec dui nunc
                    mattis enim ut tellus. Scelerisque purus semper eget duis at
                    tellus at urna condimentum. Mauris pharetra et ultrices
                    neque ornare aenean euismod. In egestas erat imperdiet sed
                    euismod. Pellentesque sit amet porttitor eget. Egestas quis
                    ipsum suspendisse ultrices gravida dictum. Eget gravida cum
                    sociis natoque penatibus et magnis dis. Ac felis donec et
                    odio pellentesque. Ac ut consequat semper viverra nam libero
                    justo laoreet.
                  </Text>
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
