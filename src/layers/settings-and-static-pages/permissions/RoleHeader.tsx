import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { RoleCode } from '../types';

const RoleHeader: FC = () => {
  const { t } = useTranslation();

  const roles = Object.values(RoleCode);
  return (
    <Box
      direction="row"
      justify="end"
      pad={{ bottom: 'small', right: 'medium' }}
    >
      {roles.map((role, index) => (
        <Box
          key={role}
          pad={index === roles.length - 1 ? 'none' : { right: '90px' }}
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
