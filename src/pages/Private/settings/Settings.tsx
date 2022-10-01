import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  TextInput,
  Text,
  Accordion,
  Select,
  Button,
  Layer,
  FileInput,
  Form,
  FormField,
  Image,
} from 'grommet';
import { CaretRightFill, Edit, Search } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { useDebouncer } from '../../../hooks/useDebouncer';
import ModifiedAccordionPanel from '../../../components/utils/ModifiedAccordionPanel';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { AppState } from '../../../store/reducers/root.reducer';
import { AvatarItem } from './Components/AvatarItem';
import {
  changeProfileInfo,
  changeProfilePicture,
} from '../../../store/actions/auth.action';
import Switch from '../../../components/utils/Switch';
// import { changeChannelPhoto } from '../../../store/actions/channel.action';

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
  fullName: string;
}

const Settings: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');
  const [channelValue, setChannelValue] = useState<any>();
  const [channelName, setChannelName] = useState<any>({
    name: 'deneme',
    description: 'desc',
  });
  const [zoneName, setZoneName] = useState<any>('');
  const [zoneValue, setZoneValue] = useState<any>();
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState<any>(null);
  // const [fileList, setFileList] = useState('');
  const history = useHistory();

  const token = 'asd';
  const {
    channel: { userChannels, selectedChannel },
    zone: {
      getUserZones: { userZones },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: user?.userName || '',
    fullName: user?.fullName || '',
  });
  const dispatch = useDispatch();

  const data: DataItemInterface[] = [
    {
      id: 0,
      key: 'personalSettings',
      label: 'Personal Settings',
      url: 'personalSettings',
      name: user?.fullName,
      role: 'Developer',
      saveButton: (
        <Button
          primary
          label="Save"
          onClick={() => {
            dispatch(changeProfileInfo(userInfo));
          }}
        />
      ),
      items: [
        {
          key: 'account',
          title: 'Account',
          items: [
            {
              key: 'username',
              title: 'Username',
              description: 'Change username',
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
              key: 'fullName',
              title: 'Full Name',
              description: 'Change your name',
              value: user?.fullName,
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
                    value={userInfo.fullName}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setUserInfo({
                        ...userInfo,
                        fullName: event.target.value,
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
              description: 'Your main email address',
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
                  onClick={() => history.push(`/reset-password/${token}`)}
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
              description: 'Change Theme',
              value: 'value',
            },
            {
              key: 'themeColor',
              title: 'Theme Color',
              description: 'Change Theme Colors',
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
      saveButton: (
        <Button
          primary
          label="Save"
          onClick={() => {
            dispatch(changeProfileInfo(userInfo));
          }}
        />
      ),
      items: [
        {
          key: 'channel1',
          title: 'Channel',
          items: [
            {
              key: 'changeChannelPhoto',
              title: 'Channel Photo',
              description: 'Change channel photo',
              value: 'value',
              component: (
                <AvatarItem
                  label={channelName.name || 'Placeholder'}
                  selectedIndex={0}
                  changeProfilePic={() => {
                    setShow(true);
                  }}
                  isEditable
                />
              ),
            },
            {
              key: 'name1',
              title: 'Channel Name',
              description: 'Change channel name',
              value: 'value',
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
                    value={channelName.name}
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
              key: 'channelTitle',
              title: 'Channel Title',
              description: 'Change channel title',
              value: 'value',
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
                    value={channelName.description}
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
              key: 'usersReact',
              title: 'React',
              description: 'Users can react',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'usersDislike',
              title: 'Dislike',
              description: 'Users can dislike',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'usersComment',
              title: 'Comment',
              description: 'Users can comment',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'channelPublic',
              title: 'Channel Visibility',
              description: 'Change channel visibility (public/private)',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
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
      saveButton: (
        <Button
          primary
          label="Save"
          onClick={() => {
            dispatch(changeProfileInfo(userInfo));
          }}
        />
      ),
      items: [
        {
          key: 'zone1',
          title: 'Zone',
          items: [
            {
              key: 'zoneName',
              title: 'Zone Name',
              description: 'Change zone name',
              value: 'value',
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
                    value={zoneName.name}
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
              key: 'zoneTitle',
              title: 'Zone Title',
              description: 'Change zone title',
              value: 'value',
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
                    value={zoneName.description}
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
              key: 'zonePublic',
              title: 'Zone Visibility',
              description: 'Change zone visibility (public/private)',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'zoneCreateChannel',
              title: 'Create Channel',
              description: 'Users can create channels',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'zoneInvite',
              title: 'Invite',
              description: 'Users can invite other users',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },

            {
              key: 'zoneDelete',
              title: 'Delete',
              description: 'Users can delete',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'zoneEdit',
              title: 'Edit',
              description: 'Users can edit',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
            },
            {
              key: 'zoneManageRole',
              title: 'Manage Roles',
              description: 'Users can manage roles',
              value: 'value',
              component: <Switch onChange={() => console.log('deneme')} />,
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
                          setChannelName({
                            name: option.props.label,
                            description: option.props.description,
                          });
                        } else {
                          setZoneValue(option);
                          setZoneName({
                            name: option.props.label,
                            description: option.props.description,
                          });
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
                      changeProfilePic={() => {
                        setShow(true);
                      }}
                      isEditable
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
                        direction="column"
                        flex="grow"
                        justify="start"
                        pad="small"
                        gap="small"
                      >
                        <Box width="medium" direction="column">
                          <Text key={formItems.key} size="medium" weight="bold">
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
                        <Box>{formItems.component && formItems.component}</Box>
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
            {data.map<React.ReactNode>((menuItem, index) => (
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
      {show && (
        <Layer>
          <Box
            width="medium"
            height="medium"
            pad="large"
            margin="small"
            justify="between"
            align="center"
            gap="small"
          >
            <Form
              onSubmit={({ value }: any) => {
                dispatch(
                  changeProfilePicture({ photoFile: value.photoFile[0] })
                );
                // setTimeout(() => setShow(false), 1000);
                setShow(false);
              }}
            >
              <Box
                width="medium"
                height="small"
                alignSelf="center"
                justify="center"
              >
                {imgSrc && <Image fit="contain" src={imgSrc && imgSrc} />}
              </Box>
              <FormField name="photoFile" htmlFor="file-input">
                <FileInput
                  name="photoFile"
                  id="photoFile"
                  multiple={false}
                  renderFile={(file) => {
                    <Box width="small" height="small">
                      <Text>
                        {/* {file.name.length > 10
                          ? `${file.name.substring(0, 10)}...`
                          : file.name} */}
                        {file.name}
                      </Text>
                    </Box>;
                  }}
                  onChange={(file) => {
                    if (file.target.files && file.target.files.length > 0) {
                      const reader = new FileReader();
                      reader.addEventListener('load', () =>
                        setImgSrc(reader?.result?.toString() || '')
                      );
                      reader.readAsDataURL(file.target.files[0]);
                    }
                  }}
                />
              </FormField>
              <Box justify="center" direction="row">
                <Button
                  label="Cancel"
                  onClick={() => setShow(false)}
                  size="large"
                />
                <Button label="Submit" type="submit" size="large" primary />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </PrivatePageLayout>
  );
};

export default Settings;
