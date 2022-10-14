import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '../../../components/utils/Divider';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { UserBasic } from '../../../store/types/auth.types';

export const UserSummary: FC<UserBasic> = ({
  fullName,
  id,
  userName,
  email,
}) => {
  const { t } = useTranslation();
  return (
    <Box gap="medium">
      <InitialsAvatar
        value={fullName}
        id={id}
        size="355px"
        round="medium"
        textProps={{ size: '120px' }}
      />
      <Text weight="bold" size="large" alignSelf="end">
        {fullName}
      </Text>
      <Divider />
      <Box align="end" gap="small">
        <Text weight="bold">{t('common.userName')}</Text>
        <Text color="status-disabled">{userName}</Text>
        <Text weight="bold">{t('common.email')}</Text>
        <Text color="status-disabled">{email}</Text>
      </Box>
    </Box>
  );
};
