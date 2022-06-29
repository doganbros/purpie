import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, TextInput, Text } from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import { useDebouncer } from '../../../hooks/useDebouncer';

type SettingFormItem = {
  key: string;
  title: string;
  description: string;
  component: JSX.Element;
};

type SettingItem = {
  key: string;
  title: string;
  items: SettingFormItem[];
};

type DataItemInterface = {
  id: number;
  key: string;
  label: string;
  url: string;
  items: SettingItem[];
};

const data: DataItemInterface[] = [
  {
    id: 0,
    key: 'settings1',
    label: 'Settings 1',
    url: 'settings1',
    items: [
      {
        key: 'account',
        title: 'Account',
        items: [
          {
            key: 'username',
            title: 'Username',
            description: 'username description',
            component: <TextInput />,
          },
          {
            key: 'name',
            title: 'Name',
            description: 'name description',
            component: <TextInput />,
          },
          {
            key: 'lastname',
            title: 'Lastname',
            description: 'lastname description',
            component: <TextInput />,
          },
        ],
      },
      {
        key: 'theme',
        title: 'Theme settings',
        items: [
          {
            key: 'themeName',
            title: 'Theme Name',
            description: 'username description',
            component: <TextInput />,
          },
          {
            key: 'themeColor',
            title: 'Theme Color',
            description: 'name description',
            component: <TextInput />,
          },
        ],
      },
    ],
  },
  {
    id: 1,
    key: 'channel',
    label: 'Channel Settings',
    url: 'channel',
    items: [
      {
        key: 'channel',
        title: 'Account',
        items: [
          {
            key: 'name',
            title: 'Channel Name',
            description: 'channel name description',
            component: <TextInput />,
          },
          {
            key: 'channelTitle',
            title: 'Channel Title',
            description: 'channel title description',
            component: <TextInput />,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    key: 'zone',
    label: 'Zone Settings',
    url: 'zone',
    items: [
      {
        key: 'zone',
        title: 'Zone',
        items: [
          {
            key: 'zoneName',
            title: 'Zone Name',
            description: 'channel name description',
            component: <TextInput />,
          },
          {
            key: 'zoneTitle',
            title: 'Zone Title',
            description: 'channel title description',
            component: <TextInput />,
          },
        ],
      },
    ],
  },
];

const Settings: FC = () => {
  const debouncer = useDebouncer();

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');
  const menuItems = data;

  const selectedItems = useMemo(() => {
    if (searchText?.length > 0) {
      if (data.length > 0) {
        const result: DataItemInterface[] = [];
        for (let i = 0; i < data.length; i++) {
          const menuItem: DataItemInterface = data[i];
          const menuItemKey = menuItem.key.replace(/ /g, '').toLowerCase();
          const menuItemLabel = menuItem.label.replace(/ /g, '').toLowerCase();
          const search = searchText.replace(/ /g, '').toLowerCase();
          if (menuItemKey.includes(search) || menuItemLabel.includes(search)) {
            result.push(menuItem);
          } else {
            const menuItemsResult = [];
            for (let j = 0; j < menuItem.items.length; j++) {
              const settingItem = menuItem.items[j];
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
              } else {
                const formItemResult = [];
                for (let k = 0; k < settingItem.items.length; k++) {
                  const settingFormItem = settingItem.items[k];
                  const formItemKey = settingFormItem.key
                    .replace(/ /g, '')
                    .toLowerCase();
                  const formItemTitle = settingFormItem.title
                    .replace(/ /g, '')
                    .toLowerCase();
                  const formItemDescription = settingFormItem.description
                    .replace(/ /g, '')
                    .toLowerCase();

                  if (
                    formItemKey.includes(search) ||
                    formItemTitle.includes(search) ||
                    formItemDescription.includes(search)
                  ) {
                    formItemResult.push(settingFormItem);
                  }
                }
                if (formItemResult.length > 0) {
                  settingItem.items = formItemResult;
                  menuItemsResult.push(settingItem);
                }
              }
            }
            if (menuItemsResult.length > 0) {
              menuItem.items = menuItemsResult;
              result.push(menuItem);
            }
          }
        }
        return result;
      }
      return [];
    }
    return [data[selectedIndex]];
  }, [searchText, selectedIndex]);

  useEffect(() => {
    debouncer(() => setSearchText(searchTextValue), 300);
  }, [searchTextValue]);

  const renderSettings = (selectedItem: DataItemInterface) => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }}>
        {searchText.length === 0 && (
          <Box>
            <Text size="xlarge">{selectedItem.label}</Text>
          </Box>
        )}
        <Box flex="grow">
          {selectedItem.items.map<React.ReactNode>((setting) => (
            <Box key={setting.key} flex="grow" pad={{ vertical: 'small' }}>
              <Text size="large">{setting.title}</Text>
              <Box>
                {setting.items.map<React.ReactNode>((formItems, index) => (
                  <>
                    <Box
                      key={formItems.key}
                      direction="row"
                      flex="grow"
                      justify="between"
                      pad="small"
                    >
                      <Box>
                        <Text size="medium">{formItems.title}</Text>
                        <Text size="small">{formItems.description}</Text>
                      </Box>
                      <Box>{formItems.component}</Box>
                    </Box>
                    {index !== setting.items.length - 1 && (
                      <Divider size="1px" />
                    )}
                  </>
                ))}
                <Box />
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  return (
    <PrivatePageLayout title="Settings">
      <Box flex={{ grow: 1 }} pad={{ vertical: 'medium' }}>
        <Box>
          <input
            placeholder="Search"
            value={searchTextValue}
            onChange={(e) => setSearchTextValue(e.target.value)}
          />
        </Box>
        <Box direction="row" margin={{ vertical: 'medium' }}>
          <Box>
            {menuItems.map<React.ReactNode>((menuItem, index) => (
              <Box
                key={menuItem.key}
                onClick={() => {
                  setSelectedIndex(index);
                  setSearchTextValue('');
                }}
                pad="small"
                background={
                  searchText.length === 0 && selectedIndex === index
                    ? 'rgba(0,0,0,0.5)'
                    : undefined
                }
              >
                <Text>{menuItem.label}</Text>
              </Box>
            ))}
          </Box>
          <Box flex="grow">
            {selectedItems.map((item) => (
              <Box key={item.key} flex="grow">
                {renderSettings(item)}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </PrivatePageLayout>
  );
};

export default Settings;
