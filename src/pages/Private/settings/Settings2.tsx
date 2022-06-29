import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { useDebouncer } from '../../../hooks/useDebouncer';
import AccountSettings from './Screens/AccountSettings';
import ChannelSettings from './Screens/ChannelSettings';

type SideMenuItem = {
  key: string;
  label: string;
};

const sideMenu: SideMenuItem[] = [
  {
    key: 'account',
    label: 'Account',
  },
  {
    key: 'channel',
    label: 'Channel',
  },
  {
    key: 'zone',
    label: 'Zone',
  },
];

const Settings: FC = () => {
  const debouncer = useDebouncer();

  const [selectedKey, setSelectedKey] = useState<string | null>('account');
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');

  useEffect(() => {
    debouncer(() => setSearchText(searchTextValue), 300);
  }, [searchTextValue]);

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
            {sideMenu.map((sideMenuItem) => (
              <Box
                key={sideMenuItem.key}
                onClick={() => {
                  setSelectedKey(sideMenuItem.key);
                  setSearchTextValue('');
                }}
                pad="small"
                background={
                  searchText.length === 0 && selectedKey === sideMenuItem.key
                    ? 'rgba(0,0,0,0.5)'
                    : undefined
                }
              >
                <Text>{sideMenuItem.label}</Text>
              </Box>
            ))}
          </Box>
          <Box flex="grow">
            {(selectedKey === 'account' || searchText.length > 0) && (
              <AccountSettings searchText={searchText} />
            )}

            {(selectedKey === 'channel' || searchText.length) > 0 && (
              <ChannelSettings searchText={searchText} />
            )}
          </Box>
        </Box>
      </Box>
    </PrivatePageLayout>
  );
};

export default Settings;
