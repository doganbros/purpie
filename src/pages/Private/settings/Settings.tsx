import React, { FC, useEffect, useMemo, useState } from 'react';
import { Box, TextInput, Text, Accordion, Select, Button } from 'grommet';
import { CaretRightFill, Edit, Search } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { useDebouncer } from '../../../hooks/useDebouncer';
import ModifiedAccordionPanel from '../../../components/utils/ModifiedAccordionPanel';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { AppState } from '../../../store/reducers/root.reducer';
import { AvatarItem } from './Components/AvatarItem';
import { changeProfileInfo } from '../../../store/actions/auth.action';

type SettingFormItem = {
  key: string;
  title: string;
  description: string;
  value?: string;
  component?: any;
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
  name?: string;
  role?: string;
  members?: string;
  whichZone?: string;
  value?: any;
  changeValue?: any;
  saveButton?: any;
  items: SettingItem[];
};

interface UserInfo {
  userName: string;
  lastName: string;
  firstName: string;
}

const Settings: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');
  const [channelValue, setChannelValue] = useState<any>();
  const [zoneValue, setZoneValue] = useState<any>();
  const history = useHistory();
  const {
    channel: { userChannels, selectedChannel },
    zone: {
      selectedUserZone,
      getUserZones: { userZones },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: user?.userName || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });
  const dispatch = useDispatch();

  const data: DataItemInterface[] = [
    {
      id: 0,
      key: 'personalSettings',
      label: 'Personal Settings',
      url: 'personalSettings',
      name: `${user?.firstName} ${user?.lastName}`,
      role: 'Developer',
      saveButton: (
        <Box responsive width="small" align="end">
          <Button
            primary
            justify="center"
            label="Save"
            onClick={() => {
              window.location.reload();
              dispatch(changeProfileInfo(userInfo));
            }}
          />
        </Box>
      ),
      items: [
        {
          key: 'account',
          title: 'Account',
          items: [
            {
              key: 'username',
              title: 'Username',
              description: 'username description',
              value: user?.userName,
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'small' }}
                  round="medium"
                  pad="xxsmall"
                >
                  <TextInput
                    value={userInfo.userName}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setUserInfo({
                        ...userInfo,
                        userName: event.target.value,
                      })
                    }
                  />

                  <Button>
                    <Edit />
                  </Button>
                </Box>
              ),
            },
            {
              key: 'name',
              title: 'Name',
              description: 'name description',
              value: user?.firstName,
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'small' }}
                  round="medium"
                  pad="xxsmall"
                >
                  <TextInput
                    value={userInfo.firstName}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setUserInfo({
                        ...userInfo,
                        firstName: event.target.value,
                      })
                    }
                  />

                  <Button>
                    <Edit />
                  </Button>
                </Box>
              ),
            },
            {
              key: 'lastname',
              title: 'Lastname',
              description: 'lastname description',
              value: user?.lastName,
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'small' }}
                  round="medium"
                  pad="xxsmall"
                >
                  <TextInput
                    value={userInfo.lastName}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setUserInfo({
                        ...userInfo,
                        lastName: event.target.value,
                      })
                    }
                  />

                  <Button>
                    <Edit />
                  </Button>
                </Box>
              ),
            },
            {
              key: 'email',
              title: 'Email',
              description: 'Email description',
              value: user?.email,
              component: <TextInput value={user?.email} />,
            },
            {
              key: 'pasword',
              title: 'Password Change',
              description: 'Change your password',
              component: (
                <Button
                  primary
                  justify="center"
                  label="Change Password"
                  onClick={() => history.push('/reset-password/asd')}
                />
              ),
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
              value: 'value',
            },
            {
              key: 'themeColor',
              title: 'Theme Color',
              description: 'name description',
              value: 'value',
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
      name: selectedChannel?.channel?.name || '',
      members: '203',
      whichZone: 'in Car Zone',
      value: channelValue,
      changeValue: (option: any) => setChannelValue(option),
      items: [
        {
          key: 'channel1',
          title: 'Channel',
          items: [
            {
              key: 'name1',
              title: 'Channel Name',
              description: 'channel name description',
              value: 'value',
              component: <TextInput value="channel name" />,
            },
            {
              key: 'channelTitle',
              title: 'Channel Title',
              description: 'channel title description',
              value: 'value',
              component: <TextInput value="channel description" />,
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
      name: 'Car Zone',
      members: '23 Zone',
      value: zoneValue,
      changeValue: (option: any) => setZoneValue(option),
      items: [
        {
          key: 'zone1',
          title: 'Zone',
          items: [
            {
              key: 'zoneName',
              title: 'Zone Name',
              description: 'channel name description',
              value: 'value',
              component: <TextInput value={selectedUserZone?.zone?.name} />,
            },
            {
              key: 'zoneTitle',
              title: 'Zone Title',
              description: 'channel title description',
              value: 'value',
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                >
                  <TextInput value={selectedUserZone?.zone?.name} />
                  <Button>
                    <Edit />
                  </Button>
                </Box>
              ),
            },
          ],
        },
      ],
    },
  ];
  const debouncer = useDebouncer();

  const menuItems = data;

  const userChannelsString = () => {
    const tempArray: Array<any> = [];

    userChannels.data.forEach((item) =>
      tempArray.push(
        <AvatarItem
          label={item.channel.name}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
        />
      )
    );
    return tempArray;
  };

  const userZonesString = () => {
    const tempArray: Array<any> = [];
    userZones?.forEach((item) => {
      tempArray.push(
        <AvatarItem
          label={item.zone.name}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
        />
      );
    });
    return tempArray;
  };

  const dropDownItems = (label: string) => {
    if (label === 'Channel Settings') {
      return userChannelsString();
    }
    if (label === 'Zone Settings') {
      return userZonesString();
    }
    return ['test'];
  };

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
  }, [searchText, selectedIndex, userInfo]);

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
        <Accordion
          flex="grow"
          border={{ color: '#E4E9F2', size: 'small' }}
          round={{ size: 'medium' }}
          pad="small"
        >
          {selectedItem.items.map<React.ReactNode>((setting, index) => (
            <Box key={setting.key} flex="grow" pad={{ vertical: 'small' }}>
              <ModifiedAccordionPanel
                label={setting.title}
                key={setting.key}
                transparent={index === selectedItem.items.length - 1}
              >
                {index === 0 && selectedItem.label !== 'Personal Settings' ? (
                  <Box direction="row" gap="small">
                    <Select
                      options={dropDownItems(selectedItem.label)}
                      value={
                        selectedItem.label === 'Channel Settings'
                          ? channelValue
                          : zoneValue
                      }
                      defaultValue={dropDownItems(selectedItem.label)[0]}
                      onChange={({ option }) => {
                        if (selectedItem.label === 'Channel Settings') {
                          setChannelValue(option);
                        } else {
                          setZoneValue(option);
                        }
                      }}
                    />
                  </Box>
                ) : (
                  setting.title === 'Account' && (
                    <AvatarItem
                      label={userInfo.userName}
                      menuItems={menuItems}
                      selectedIndex={0}
                      changeProfilePic={() => {}}
                    />
                  )
                )}
                <Box>
                  {setting.items.map<React.ReactNode | any>((formItems) => {
                    const descriptionParts = formItems.description.split(
                      new RegExp(`(${searchText})`, 'gi')
                    );
                    const titleParts = formItems.title.split(
                      new RegExp(`(${searchText})`, 'gi')
                    );

                    return (
                      // eslint-disable-next-line react/jsx-key
                      <Box
                        key={formItems.key}
                        direction="row"
                        flex="grow"
                        justify="start"
                        pad="small"
                      >
                        <Box width="small">
                          <Text key={formItems.key}>
                            {/* {formItems.title} */}
                            {titleParts.map((part) =>
                              part.toLowerCase() !==
                              searchText.toLowerCase() ? (
                                `${part}`
                              ) : (
                                <Text weight="bold">{part}</Text>
                              )
                            )}
                          </Text>
                          <Text key={formItems.key}>
                            {descriptionParts.map((part) =>
                              part.toLowerCase() !==
                              searchText.toLowerCase() ? (
                                `${part}`
                              ) : (
                                <Text weight="bold">{part}</Text>
                              )
                            )}
                          </Text>
                        </Box>
                        {/* <Box>{formItems.component}</Box> */}
                        <Box>
                          {formItems.value ? (
                            formItems.component
                          ) : (
                            <Button
                              primary
                              justify="center"
                              label="Change Password"
                              onClick={() =>
                                history.push('/reset-password/asd')
                              }
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
                {selectedItem.saveButton && selectedItem.saveButton}
              </ModifiedAccordionPanel>
            </Box>
          ))}
        </Accordion>
      </Box>
    );
  };

  return (
    <PrivatePageLayout title="Settings">
      <Box flex={{ grow: 1 }} pad={{ vertical: 'medium' }}>
        <Box>
          <TextInput
            placeholder="Search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            icon={<Search color="light-4" />}
            reverse
          />
        </Box>
        <Box direction="row" margin={{ vertical: 'medium' }}>
          <Box>
            {menuItems.map<React.ReactNode>((menuItem, index) => (
              <>
                <Box
                  focusIndicator={false}
                  key={menuItem.key}
                  onClick={() => {
                    setSelectedIndex(index);
                    setSearchTextValue('');
                  }}
                  pad="small"
                  justify="between"
                  direction="row"
                  width="medium"
                >
                  <Text>{menuItem.label}</Text>
                  <CaretRightFill color="brand" />
                </Box>
                <Divider />
              </>
            ))}
          </Box>
          <Box flex="grow">
            {selectedItems.map((item) => (
              <Box key={item.key} margin={{ vertical: 'xsmall' }}>
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
