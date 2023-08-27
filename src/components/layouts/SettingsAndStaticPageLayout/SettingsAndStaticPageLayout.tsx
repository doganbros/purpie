import React, { FC, useContext, useEffect, useState } from 'react';
import { Box, ResponsiveContext } from 'grommet';
import { Menu } from './types';
import './Style.scss';
import SettingsNavbar from './SettingsNavbar';
import SettingsSidebar from './SettingsSidebar';
import SettingsAndStaticPage from './SettingsAndStaticPage';

interface SettingsAndStaticPageLayoutProps {
  pageTitle: string;
  menuList: Menu[];
  pageUrl?: string;
}

const SettingsAndStaticPageLayout: FC<SettingsAndStaticPageLayoutProps> = ({
  pageTitle,
  menuList,
  pageUrl,
}) => {
  const size = useContext(ResponsiveContext);

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');

  useEffect(() => {
    const activePageIndex = menuList.findIndex((m) => m.url === pageUrl);
    if (activePageIndex !== -1) setSelectedIndex(activePageIndex);
  }, [pageUrl]);

  return (
    <Box flex={{ grow: 1 }}>
      <SettingsNavbar search={searchText} setSearch={setSearchText} />

      <Box
        direction={size === 'small' ? 'column' : 'row'}
        pad={{ horizontal: 'medium', bottom: 'medium' }}
      >
        <SettingsSidebar
          title={pageTitle}
          menuList={menuList}
          search={searchText}
          setSearch={setSearchText}
          selectedMenuIndex={selectedIndex}
          setSelectedMenuIndex={setSelectedIndex}
        />

        <Box justify="center" fill="horizontal" align="center">
          <Box
            flex="grow"
            round="medium"
            pad={size === 'small' ? '0' : 'medium'}
            overflow="auto"
            fill="horizontal"
            width={{ max: '1440px' }}
            className="settings-and-static-page-container"
          >
            <SettingsAndStaticPage
              menuList={menuList}
              selectedIndex={selectedIndex}
              searchText={searchText}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsAndStaticPageLayout;
