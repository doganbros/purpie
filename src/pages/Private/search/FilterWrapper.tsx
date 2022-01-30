import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { SettingsOption } from 'grommet-icons';
import Divider from '../../../components/utils/Divider';

const FilterWrapper: FC = ({ children }) => (
  <Box
    round="medium"
    pad="medium"
    gap="medium"
    border={{ size: '1px', side: 'all', color: 'status-disabled-light' }}
  >
    <Box direction="row" justify="between">
      <Text weight="bold">Search Filter</Text>
      <SettingsOption color="status-disabled" />
    </Box>
    <Divider size="1px" />
    {children}
  </Box>
);

export default FilterWrapper;
