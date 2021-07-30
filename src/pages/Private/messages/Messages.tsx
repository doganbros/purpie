import React, { FC } from 'react';
import { Box, Card, Heading, Text } from 'grommet';

import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';

const Messages: FC = () => {
  return (
    <PrivatePageLayout
      title="Messages"
      topComponent={<Heading level="3">Messages</Heading>}
    >
      <Card pad="large">
        <Text>On this page, there is no right sidebar.</Text>
      </Card>
      <Box pad="medium">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
          delectus amet perspiciatis quam perferendis suscipit earum fugiat!
          Esse itaque non dicta voluptate dolore, tempore accusantium
          consequatur veniam magnam eveniet aspernatur!
        </Text>
      </Box>
      <Box pad="medium">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
          delectus amet perspiciatis quam perferendis suscipit earum fugiat!
          Esse itaque non dicta voluptate dolore, tempore accusantium
          consequatur veniam magnam eveniet aspernatur!
        </Text>
      </Box>
      <Box pad="medium">
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ratione
          delectus amet perspiciatis quam perferendis suscipit earum fugiat!
          Esse itaque non dicta voluptate dolore, tempore accusantium
          consequatur veniam magnam eveniet aspernatur!
        </Text>
      </Box>
    </PrivatePageLayout>
  );
};

export default Messages;
