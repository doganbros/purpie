import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { SettingsOption } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import Divider from '../../../components/utils/Divider';

const FilterWrapper: FC = ({ children }) => {
  const { t } = useTranslation();

  return (
    <Box
      round="medium"
      pad="medium"
      gap="medium"
      border={{ size: '1px', side: 'all', color: 'status-disabled-light' }}
    >
      <Box direction="row" justify="between">
        <Text weight="bold">{t('common.searchFilter')}</Text>
        <SettingsOption color="status-disabled" />
      </Box>
      <Divider size="1px" />
      {children}
    </Box>
  );
};

export default FilterWrapper;
