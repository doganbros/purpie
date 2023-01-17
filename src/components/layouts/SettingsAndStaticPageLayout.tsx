import React, { FC, useEffect, useState } from 'react';
import { Accordion, AccordionPanel, Avatar, Box, Text } from 'grommet';
import { CaretRightFill, Previous } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import LogoWhite from '../../../assets/purpie-logo/logo-white.svg';
import './Style.scss';
import { useTitle } from '../../hooks/useTitle';
import { useDebouncer } from '../../hooks/useDebouncer';
import {
  PageData,
  PageItem,
} from '../../layers/settings-and-static-pages/types';
import SearchBar from '../../layers/settings-and-static-pages/SearchBar';
import Divider from '../utils/Divider';

interface SettingsAndStaticPageLayoutProps {
  menuList: PageData[];
}

const SettingsAndStaticPageLayout: FC<SettingsAndStaticPageLayoutProps> = ({
  menuList,
}) => {
  const { t } = useTranslation();
  useTitle(t('settings.documentTitle'));
  const history = useHistory();
  const debouncer = useDebouncer();

  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');

  useEffect(() => {
    debouncer(() => setSearchText(searchTextValue), 300);
    if (!searchTextValue) {
      setActiveAccordionIndex(0);
    }
  }, [searchTextValue]);

  const getSearchResults = () => {
    if (menuList.length > 0) {
      const result: PageData[] = [];
      menuList.forEach((menuItem) => {
        const menuItemKey = menuItem.key.replace(/ /g, '').toLowerCase();
        const menuItemLabel = menuItem.label.replace(/ /g, '').toLowerCase();
        const search = searchText.replace(/ /g, '').toLowerCase();
        if (menuItemKey.includes(search) || menuItemLabel.includes(search)) {
          result.push(menuItem);
        } else {
          const menuItemsResult: PageItem[] = [];
          menuItem?.items?.forEach((settingItem) => {
            const settingItemKey = settingItem.key
              .replace(/ /g, '')
              .toLowerCase();
            const settingItemLabel = settingItem.title
              .replace(/ /g, '')
              .toLowerCase();

            if (
              settingItemKey.includes(search) ||
              settingItemLabel.includes(search)
            ) {
              menuItemsResult.push(settingItem);
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

  const renderSettingCategory = (selectedItem: PageData) => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }} gap="medium">
        {searchText.length === 0 && (
          <Box>
            <Text size="xlarge">{selectedItem.label}</Text>
          </Box>
        )}
        <Box direction="row" justify="between">
          {selectedItem.avatarWidget}
          {!selectedItem.isEmpty && selectedItem.saveButton}
        </Box>
        {selectedItem?.items?.map<React.ReactNode>((setting) => {
          const titleParts = setting.title
            .split(new RegExp(`(${searchText})`, 'gi'))
            .map((p) => ({ part: p, id: nanoid() }));

          return (
            <Box
              key={setting.key}
              direction="column"
              flex="grow"
              justify="start"
              gap="small"
            >
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
              <Box>{setting.component && setting.component}</Box>
            </Box>
          );
        })}
      </Box>
    );
  };

  const renderSettings = () => {
    if (searchText?.length > 0) {
      const selectedItems = getSearchResults();
      if (selectedItems.length === 0) {
        return <Text>{t('settings.noSettings')}</Text>;
      }
      return (
        <Accordion
          activeIndex={activeAccordionIndex}
          onActive={(i) => setActiveAccordionIndex(i[0])}
        >
          {selectedItems.map((item) => (
            <AccordionPanel label={item.label} key={item.key}>
              <Box pad={{ vertical: 'small' }}>
                {renderSettingCategory(item)}
              </Box>
            </AccordionPanel>
          ))}
        </Accordion>
      );
    }
    return renderSettingCategory(menuList[selectedIndex]);
  };

  return (
    <Box flex={{ grow: 1 }}>
      <Box direction="row" pad="medium" background="brand" height="100px">
        <Box
          onClick={() => history.push('/')}
          width="300px"
          align="start"
          justify="start"
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
      <Box direction="row" pad={{ horizontal: 'medium', bottom: 'medium' }}>
        <Box justify="between">
          <Box>
            <Box
              direction="row"
              gap="small"
              margin={{ top: '40px' }}
              onClick={() => history.goBack()}
              focusIndicator={false}
            >
              <Previous size="24px" color="brand" />
              <Text> {t('common.back')}</Text>
            </Box>
            <Box pad={{ horizontal: 'small', top: 'medium', bottom: 'small' }}>
              <Text weight="bold" color="brand">
                {t('settings.settings')}
              </Text>
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
        <Box justify="center" fill="horizontal" align="center">
          <Box
            flex="grow"
            round="medium"
            pad="medium"
            overflow="auto"
            fill="horizontal"
            width={{ max: '1440px' }}
            className="settings-container"
          >
            {renderSettings()}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default SettingsAndStaticPageLayout;