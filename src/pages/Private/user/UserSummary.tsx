import { Box, Text } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import Divider from '../../../components/utils/Divider';
import { UserBasic } from '../../../store/types/auth.types';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';

export const UserSummary: FC<UserBasic> = ({
  fullName,
  id,
  userName,
  email,
  displayPhoto,
}) => {
  const { t } = useTranslation();
  return (
    <Box gap="medium">
      <UserAvatar
        id={id}
        name={fullName}
        src={displayPhoto}
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
