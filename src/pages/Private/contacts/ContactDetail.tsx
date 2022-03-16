import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import Divider from '../../../components/utils/Divider';

const ContactDetail: FC = () => (
  <Box pad="medium" gap="medium">
    <Box
      height="332px"
      background="brand"
      round="medium"
      align="center"
      justify="center"
      alignSelf="stretch"
    >
      <Text color="white" size="120px">
        FK
      </Text>
    </Box>
    <Text weight="bold" size="large" alignSelf="end">
      Fecri Kaan Ulubey
    </Text>
    <Divider />
    <Box align="end" gap="small">
      <Text weight="bold">User Name</Text>
      <Text color="status-disabled">@fecrikaan</Text>
      <Text weight="bold">Email</Text>
      <Text color="status-disabled">f.kaan93@gmail.com</Text>
    </Box>
    <Button
      primary
      color="status-error"
      alignSelf="center"
      margin={{ vertical: 'medium' }}
      label="Remove from Contacts"
    />
  </Box>
);

export default ContactDetail;
