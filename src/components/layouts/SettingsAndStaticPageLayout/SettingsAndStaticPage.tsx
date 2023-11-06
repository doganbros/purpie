import React, { FC, useContext, useState } from 'react';
import {
  Accordion,
  AccordionPanel,
  Box,
  ResponsiveContext,
  Text,
} from 'grommet';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import { Menu, MenuItem } from './types';
import './Style.scss';

interface SettingsAndStaticPageLayoutProps {
  menuList: Menu[];
  searchText: string;
  selectedIndex: number;
}

const SettingsAndStaticPage: FC<SettingsAndStaticPageLayoutProps> = ({
  menuList,
  searchText,
  selectedIndex,
}) => {
  const size = useContext(ResponsiveContext);

  const [permissionTab, setPermissionTab] = useState(0);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);

  const { t } = useTranslation();

  const sanitizeMenuItem = (value: string) => {
    return value.replace(/ /g, '').toLowerCase();
  };

  const getSearchMenuList = () => {
    if (menuList.length > 0) {
      const searchedMenuList: Menu[] = [];

      menuList.forEach((menu) => {
        const menuKey = sanitizeMenuItem(menu.key);
        const menuLabel = sanitizeMenuItem(menu.label);
        const search = sanitizeMenuItem(searchText);

        if (menuKey.includes(search) || menuLabel.includes(search)) {
          searchedMenuList.push(menu);
        } else {
          const searchedMenuItemList: MenuItem[] = [];
          menu.items?.forEach((menuItem) => {
            const menuItemKey = sanitizeMenuItem(menuItem.key);
            const menuItemLabel = sanitizeMenuItem(menuItem.label);

            if (
              menuItemKey.includes(search) ||
              menuItemLabel.includes(search)
            ) {
              searchedMenuItemList.push(menuItem);
            }
          });
          if (searchedMenuItemList.length > 0) {
            searchedMenuList.push({ ...menu, items: searchedMenuItemList });
          }
        }
      });

      return searchedMenuList;
    }
    return [];
  };

  const groupByTabIndex = (menuItems?: MenuItem[]) => {
    return menuItems?.reduce((group: any, item) => {
      if (item.tabIndex) {
        const { tabIndex } = item;

        // eslint-disable-next-line no-param-reassign
        group[tabIndex] = group[tabIndex] ?? [];
        group[tabIndex].push(item);
        return group;
      }
      return {};
    }, {});
  };

  const renderMenuItem = (menuItem: MenuItem) => {
    const labelParts = menuItem.label
      .split(new RegExp(`(${searchText})`, 'gi'))
      .map((p) => ({ part: p, id: nanoid() }));

    return (
      <Box
        key={menuItem.key}
        direction="column"
        flex="shrink"
        justify="start"
        gap="small"
        className="z-index--1"
      >
        {size !== 'small' && labelParts.length > 0 && (
          <Box width="medium" direction="column">
            <Text size="medium" weight={500}>
              {labelParts.map(({ part, id }) =>
                part.toLowerCase() !== searchText!.toLowerCase() ? (
                  `${part}`
                ) : (
                  <Text key={id} weight="bold">
                    {part}
                  </Text>
                )
              )}
            </Text>
          </Box>
        )}
        <Box>{menuItem.component}</Box>
      </Box>
    );
  };

  const renderMenu = (menu: Menu) => {
    const tabGroups = groupByTabIndex(menu.items);

    return (
      <Box flex="grow" pad={{ horizontal: 'small' }} gap="medium">
        {!searchText && size !== 'small' && !menu.labelNotVisible && (
          <Box>
            <Text size="xlarge">{menu.label}</Text>
          </Box>
        )}
        {(menu.header || menu.action) && (
          <Box
            direction={size === 'small' ? 'column' : 'row'}
            justify="between"
          >
            {menu.header}
            {menu.action}
          </Box>
        )}
        {!searchText && menu.tabs && menu.tabs.length > 1 && (
          <Accordion
            activeIndex={permissionTab}
            onActive={(i) => {
              setPermissionTab(i[0]);
            }}
          >
            {menu.tabs.map((tab) => (
              <AccordionPanel label={tab.label} key={tab.label}>
                <Box
                  pad={{ horizontal: 'xsmall', vertical: 'small' }}
                  gap="small"
                >
                  {(permissionTab || permissionTab === 0) &&
                    tabGroups[permissionTab + 1].map((menuItem: MenuItem) =>
                      renderMenuItem(menuItem)
                    )}
                </Box>
              </AccordionPanel>
            ))}
          </Accordion>
        )}
        {(!menu.tabs || menu.tabs.length <= 1) &&
          menu?.items?.map<React.ReactNode>((menuItem) =>
            renderMenuItem(menuItem)
          )}
      </Box>
    );
  };

  if (searchText.length === 0 && size !== 'small')
    return renderMenu(menuList[selectedIndex]);

  const searchedMenuList = getSearchMenuList();

  return searchedMenuList.length === 0 ? (
    <Text>{t('StaticPage.noSearch')}</Text>
  ) : (
    <Accordion
      activeIndex={activeAccordionIndex}
      onActive={(i) => setActiveAccordionIndex(i[0])}
    >
      {searchedMenuList.map((menu) => (
        <AccordionPanel label={menu.label} key={menu.key}>
          <Box pad={{ vertical: 'small' }}>{renderMenu(menu)}</Box>
        </AccordionPanel>
      ))}
    </Accordion>
  );
};

export default SettingsAndStaticPage;
