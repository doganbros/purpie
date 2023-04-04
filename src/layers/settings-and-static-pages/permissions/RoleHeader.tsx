import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { ChannelRoleCode } from '../../../store/types/channel.types';

const RoleHeader: FC = () => {
  const { t } = useTranslation();

  const roles = Object.values(ChannelRoleCode);
  return (
    <Box direction="row" justify="end" pad={{ right: 'small' }}>
      {roles.map((role, index) => (
        <Box
          key={role}
          pad={index === roles.length - 1 ? 'none' : { right: '30px' }}
        >
          <Text size="small" color="light-turquoise">
            {t(`Permissions.${role}`)}
          </Text>
        </Box>
      ))}
    </Box>
  );
};

export default RoleHeader;
