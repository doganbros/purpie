import React, { FC, useState } from 'react';
import { Box, TextInput, Text } from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';

const data = [
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const menuItems = data;
  const selectedItem = menuItems[selectedIndex];

  const renderSettings = () => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }}>
        <Box>
          <Text size="xlarge">{selectedItem.label}</Text>
        </Box>
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
          <input placeholder="Search" />
        </Box>
        <Box direction="row" margin={{ vertical: 'medium' }}>
          <Box>
            {menuItems.map<React.ReactNode>((menuItem, index) => (
              <Box
                key={menuItem.key}
                onClick={() => setSelectedIndex(index)}
                pad="small"
                background={
                  selectedIndex === index ? 'rgba(0,0,0,0.5)' : undefined
                }
              >
                <Text>{menuItem.label}</Text>
              </Box>
            ))}
          </Box>
          <Box flex="grow">{renderSettings()}</Box>
        </Box>
      </Box>
    </PrivatePageLayout>
  );
};

export default Settings;
