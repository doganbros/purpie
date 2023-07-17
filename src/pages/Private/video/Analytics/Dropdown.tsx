/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, Menu, Text } from 'grommet';

interface DropdownItem {
  label: string;
  onClick: () => void;
}

interface DropdownProps {
  title: string;
  menuItems: DropdownItem[];
}

const Dropdown: FC<DropdownProps> = ({ title, menuItems }) => {
  return (
    <Box width="100%" border={{ color: '#EFF0F6', size: 'small' }} round>
      <Menu
        label={
          <Box>
            <Text>{title}</Text>
          </Box>
        }
        items={[...menuItems]}
        justifyContent="between"
      />
    </Box>
  );
};

export default Dropdown;
