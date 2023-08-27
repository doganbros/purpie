import { Box, ResponsiveContext, Text } from 'grommet';
import React, { FC, useContext } from 'react';
import { CaretLeftFill, CaretRightFill, Previous } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Divider from '../PrivatePageLayout/ZoneSelector/Divider';
import { Menu } from './types';

interface SettingsSidebarProps {
  title: string;
  menuList: Menu[];
  search: string;
  setSearch: (val: string) => void;
  selectedMenuIndex: number;
  setSelectedMenuIndex: (val: number) => void;
}

const SettingsSidebar: FC<SettingsSidebarProps> = ({
  title,
  menuList,
  search,
  setSearch,
  selectedMenuIndex,
  setSelectedMenuIndex,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);

  if (size !== 'small')
    return (
      <Box justify="between">
        <Box>
          <Box
            direction="row"
            gap="small"
            margin={{ top: '30px' }}
            onClick={() => history.goBack()}
            focusIndicator={false}
            align="center"
            pad={{ bottom: 'small' }}
          >
            <CaretLeftFill size="36px" color="brand" />
            <Text> {t('common.back')}</Text>
          </Box>
          <Box pad={{ horizontal: 'small', vertical: 'large' }}>
            <Text weight="bold">{title}</Text>
          </Box>
          {menuList.map((menuItem, index) => (
            <React.Fragment key={menuItem.key}>
              <Box
                focusIndicator={false}
                onClick={() => {
                  setSelectedMenuIndex(index);
                  setSearch('');
                }}
                pad="small"
                justify="between"
                direction="row"
                width="300px"
              >
                <Text
                  weight={
                    index === selectedMenuIndex && search === ''
                      ? 'bold'
                      : 'normal'
                  }
                >
                  {menuItem.label}
                </Text>
                <CaretRightFill color="brand" />
              </Box>
              <Divider color="status-disabled-light" />
            </React.Fragment>
          ))}
        </Box>
      </Box>
    );

  return (
    <Box
      direction="row"
      gap="small"
      margin={{ top: 'large' }}
      onClick={() => history.goBack()}
      focusIndicator={false}
      align="center"
      pad={{ bottom: 'small' }}
    >
      <Previous size="24px" color="brand" />
      <Text> {t('common.back')}</Text>
    </Box>
  );
};

export default SettingsSidebar;
