import React, { FC, useContext, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  ResponsiveContext,
  Text,
} from 'grommet';
import { CaretLeftFill, CaretRightFill, Previous } from 'grommet-icons';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import LogoWhite from '../../../assets/purpie-logo/logo-white.svg';
import Divider from '../PrivatePageLayout/ZoneSelector/Divider';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { Menu, MenuItem } from './types';
import './Style.scss';
import SearchBar from './SearchBar';

interface SettingsAndStaticPageLayoutProps {
  pageTitle: string;
  menuList: Menu[];
  pageUrl?: string;
}

interface LocationState {
  selectedIndex: number;
}

const SettingsAndStaticPageLayout: FC<SettingsAndStaticPageLayoutProps> = ({
  pageTitle,
  menuList,
  pageUrl,
}) => {
  const history = useHistory();
  const size = useContext(ResponsiveContext);
  const { state }: { state: LocationState } = useLocation();

  const { selectedIndex: channelShortSelectedIndex } = (state ||
    {}) as LocationState;

  const [activeTab, setActiveTab] = useState(1);
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    channelShortSelectedIndex || 0
  );
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const { t } = useTranslation();

  const debouncer = useDebouncer();

  const getSearchResults = () => {
    if (menuList.length > 0) {
      const result: Menu[] = [];
      menuList.forEach((menuItem) => {
        const menuItemKey = menuItem.key.replace(/ /g, '').toLowerCase();
        const menuItemLabel = menuItem.label.replace(/ /g, '').toLowerCase();
        const search = searchText.replace(/ /g, '').toLowerCase();
        if (menuItemKey.includes(search) || menuItemLabel.includes(search)) {
          result.push(menuItem);
        } else {
          const menuItemsResult: MenuItem[] = [];
          menuItem?.items?.forEach((item) => {
            const itemKey = item.key.replace(/ /g, '').toLowerCase();
            const itemLabel = item.title.replace(/ /g, '').toLowerCase();

            if (itemKey.includes(search) || itemLabel.includes(search)) {
              menuItemsResult.push(item);
            }
          });
          if (menuItemsResult.length > 0) {
            result.push({ ...menuItem, items: menuItemsResult });
          }
        }
      });

      return result;
    }
    return [];
  };

  useEffect(() => {
    const activePageIndex = menuList.findIndex((m) => m.url === pageUrl);
    if (activePageIndex !== -1) setSelectedIndex(activePageIndex);
  }, [pageUrl]);

  useEffect(() => {
    debouncer(() => setSearchText(searchTextValue), 300);
    if (!searchTextValue) {
      setActiveAccordionIndex(0);
    }
  }, [searchTextValue]);

  const groupByTabIndex = (menuItems: MenuItem[]) => {
    return menuItems.reduce((group: any, item) => {
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
  const renderContentCategoryContent = (menuItem: MenuItem) => {
    const titleParts = menuItem.title
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
        {size !== 'small' && titleParts.length > 0 && (
          <Box width="medium" direction="column">
            <Text size="medium" weight="bold">
              {titleParts.map(({ part, id }) =>
                part.toLowerCase() !== searchText.toLowerCase() ? (
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
        <Box>{menuItem.component && menuItem.component}</Box>
      </Box>
    );
  };

  const renderContentCategory = (selectedMenu: Menu) => {
    const tabGroups = groupByTabIndex(selectedMenu.items!);

    return (
      <Box flex="grow" pad={{ horizontal: 'small' }} gap="medium">
        {!selectedMenu.labelNotVisible &&
          searchText.length === 0 &&
          size !== 'small' && (
            <Box>
              <Text size="xlarge">{selectedMenu.label}</Text>
            </Box>
          )}
        <Box direction={size === 'small' ? 'column' : 'row'} justify="between">
          {selectedMenu.avatarWidget}
          {selectedMenu.deletePopup}
          {selectedMenu.leavePopup}
          <Box direction="row" gap="small" align="end">
            {!selectedMenu.isEmpty &&
              selectedMenu.showLeaveButton &&
              selectedMenu.leaveButton}
            {!selectedMenu.isEmpty &&
              selectedMenu.canDelete &&
              selectedMenu.deleteButton}
            {!selectedMenu.isEmpty && selectedMenu.saveButton}
          </Box>
        </Box>
        {!searchText && selectedMenu.tabs && selectedMenu.tabs.length > 1 ? (
          <Box gap="medium" className="z-index--1">
            <Box direction="row" gap="medium">
              {selectedMenu.tabs.map((tab) => (
                <Button
                  key={`timelineTab-${tab.index}`}
                  onClick={() => {
                    setActiveTab(tab.index);
                  }}
                  plain
                >
                  <Box
                    align="center"
                    border={{
                      side: 'bottom',
                      size: 'small',
                      color:
                        activeTab === tab.index ? 'brand' : 'status-disabled',
                    }}
                    pad={{ horizontal: 'xsmall' }}
                  >
                    <Text
                      size="medium"
                      weight="bold"
                      color={
                        activeTab === tab.index ? 'brand' : 'status-disabled'
                      }
                    >
                      {tab.label}
                    </Text>
                  </Box>
                </Button>
              ))}
            </Box>
            {tabGroups[activeTab].map((menuItem: MenuItem) =>
              renderContentCategoryContent(menuItem)
            )}
          </Box>
        ) : (
          selectedMenu?.items?.map<React.ReactNode>((menuItem) =>
            renderContentCategoryContent(menuItem)
          )
        )}
      </Box>
    );
  };

  const renderContent = () => {
    if (searchText?.length > 0 || size === 'small') {
      const selectedItems = getSearchResults();
      if (selectedItems.length === 0) {
        return <Text>{t('StaticPage.noSearch')}</Text>;
      }
      return (
        <Accordion
          activeIndex={activeAccordionIndex}
          onActive={(i) => setActiveAccordionIndex(i[0])}
        >
          {selectedItems.map((item) => (
            <AccordionPanel label={item.label} key={item.key}>
              <Box pad={{ vertical: 'small' }}>
                {renderContentCategory(item)}
              </Box>
            </AccordionPanel>
          ))}
        </Accordion>
      );
    }
    return renderContentCategory(menuList[selectedIndex]);
  };

  return (
    <Box flex={{ grow: 1 }}>
      <Box direction="row" pad="medium" background="brand" height="100px">
        <Box
          onClick={() => history.push('/')}
          width="300px"
          align="start"
          justify="center"
          focusIndicator={false}
        >
          <Avatar round="0" src={LogoWhite} />
        </Box>
        <Box fill="horizontal" justify="center">
          <Box
            fill="horizontal"
            width={{ max: '1440px' }}
            alignSelf="center"
            pad={{ horizontal: 'medium' }}
          >
            <SearchBar value={searchText} onChange={setSearchText} />
          </Box>
        </Box>
      </Box>
      <Box
        direction={size === 'small' ? 'column' : 'row'}
        pad={{ horizontal: 'medium', bottom: 'medium' }}
      >
        {size !== 'small' ? (
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
                <Text weight="bold">{pageTitle}</Text>
              </Box>
              {menuList.map((menuItem, index) => (
                <React.Fragment key={menuItem.key}>
                  <Box
                    focusIndicator={false}
                    onClick={() => {
                      setSelectedIndex(index);
                      setSearchTextValue('');
                    }}
                    pad="small"
                    justify="between"
                    direction="row"
                    width="300px"
                  >
                    <Text
                      weight={
                        index === selectedIndex && searchText === ''
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
        ) : (
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
        )}
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
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsAndStaticPageLayout;
