import React, { FC, useEffect, useState } from 'react';
import { Accordion, AccordionPanel, Avatar, Box, Button, Text } from 'grommet';
import { CaretRightFill, Home } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LogoWhite from '../../../assets/purpie-logo/logo-white.svg';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { useDebouncer } from '../../../hooks/useDebouncer';
import ChannelSettings from './ChannelSettings';
import PersonalSettings from './PersonalSettings';
import SearchBar from './SearchBar';
import { SettingFormItem, SettingsData } from './types';
import ZoneSettings from './ZoneSettings';

const Settings: FC = () => {
  const history = useHistory();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const { t } = useTranslation();

  const data: SettingsData[] = [
    PersonalSettings(),
    ChannelSettings(),
    ZoneSettings(),
  ].filter((v): v is SettingsData => v !== null);
  const debouncer = useDebouncer();

  const getSearchResults = () => {
    if (data.length > 0) {
      const result: SettingsData[] = [];
      data.forEach((menuItem) => {
        const menuItemKey = menuItem.key.replace(/ /g, '').toLowerCase();
        const menuItemLabel = menuItem.label.replace(/ /g, '').toLowerCase();
        const search = searchText.replace(/ /g, '').toLowerCase();
        if (menuItemKey.includes(search) || menuItemLabel.includes(search)) {
          result.push(menuItem);
        } else {
          const menuItemsResult: SettingFormItem[] = [];
          menuItem?.items?.forEach((settingItem) => {
            const settingItemKey = settingItem.key
              .replace(/ /g, '')
              .toLowerCase();
            const settingItemLabel = settingItem.title
              .replace(/ /g, '')
              .toLowerCase();
            const settingItemDescription = settingItem.description
              .replace(/ /g, '')
              .toLowerCase();

            if (
              settingItemKey.includes(search) ||
              settingItemLabel.includes(search) ||
              settingItemDescription.includes(search)
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

  useEffect(() => {
    debouncer(() => setSearchText(searchTextValue), 300);
    if (!searchTextValue) {
      setActiveAccordionIndex(0);
    }
  }, [searchTextValue]);

  const renderSettingCategory = (selectedItem: SettingsData) => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }} gap="medium">
        {searchText.length === 0 && (
          <Box>
            <Text size="xlarge">{selectedItem.label}</Text>
          </Box>
        )}
        <Box direction="row" justify="between">
          {selectedItem.avatarWidget}
          <Button
            onClick={selectedItem.onSave}
            primary
            label={t('settings.save')}
            disabled={selectedItem.isEmpty}
            margin={{ vertical: 'medium' }}
          />
        </Box>
        {selectedItem?.items?.map<React.ReactNode>((setting) => {
          const descriptionParts = setting.description.split(
            new RegExp(`(${searchText})`, 'gi')
          );
          const titleParts = setting.title.split(
            new RegExp(`(${searchText})`, 'gi')
          );

          return (
            <Box
              key={setting.key}
              direction="column"
              flex="grow"
              justify="start"
              gap="small"
            >
              <Box width="medium" direction="column">
                <Text key={setting.key} size="medium" weight="bold">
                  {titleParts.map((part) =>
                    part.toLowerCase() !== searchText.toLowerCase() ? (
                      `${part}`
                    ) : (
                      <Text weight="bold">{part}</Text>
                    )
                  )}
                </Text>
                <Text key={setting.key}>
                  {descriptionParts.map((part) =>
                    part.toLowerCase() !== searchText.toLowerCase() ? (
                      `${part}`
                    ) : (
                      <Text weight="bold">{part}</Text>
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
    return renderSettingCategory(data[selectedIndex]);
  };

  return (
    <Box>
      <Box flex={{ grow: 1 }}>
        <Box
          direction="row"
          gap="large"
          pad="medium"
          align="center"
          background="brand"
        >
          <Box onClick={() => history.push('/')} pad={{ right: 'large' }}>
            <Avatar
              alignSelf="center"
              size="medium"
              round="0"
              src={LogoWhite}
            />
          </Box>
          <Box pad={{ right: 'medium' }} />
          <Box flex={{ grow: 1 }} pad={{ left: 'xlarge' }}>
            <SearchBar value={searchText} onChange={setSearchText} />
          </Box>
        </Box>
        <Box direction="row" pad={{ horizontal: 'medium', bottom: 'medium' }}>
          <Box justify="between">
            <Box>
              <Box
                pad={{ horizontal: 'small', top: 'medium', bottom: 'small' }}
              >
                <Text weight="bold" color="brand">
                  {t('settings.settings')}
                </Text>
              </Box>
              {data.map((menuItem, index) => (
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
            <Box
              direction="row"
              align="center"
              gap="small"
              onClick={() => history.push('/')}
            >
              <Home color="brand" size="large" fontWeight="bold" />

              <Text color="brand" weight="bold">
                Home Page
              </Text>
            </Box>
          </Box>
          <Box justify="center" fill="horizontal" align="center">
            <Box
              flex="grow"
              round="medium"
              pad="medium"
              height="80vh"
              overflow="auto"
              fill="horizontal"
              width={{ max: '1440px' }}
            >
              {renderSettings()}
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Settings;
