import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Text,
  Accordion,
  Button,
  Layer,
  FileInput,
  Form,
  FormField,
  Image,
  TextInput,
  Grid,
  DropButton,
  CheckBox,
} from 'grommet';
import { CaretRightFill, Hide, Search, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
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
import SectionContainer from '../../../components/utils/SectionContainer';
import {
  changeChannelInformationAction,
  changeChannelPermissionsAction,
  changeChannelPhoto,
} from '../../../store/actions/channel.action';
import {
  changeZoneInformationAction,
  changeZonePermissionsAction,
  changeZonePhoto,
} from '../../../store/actions/zone.action';

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
  const [zoneValue, setZoneValue] = useState<any>();
  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [reveal, setReveal] = useState<any>({
    current: false,
    new: false,
    confirm: false,
  });
  const [medium, setMedium] = useState<{ name: string; id: number }>({
    name: 'user',
    id: 1,
  });

  const {
    channel: { userChannels },
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

  const [channelName, setChannelName] = useState<any>({
    name: userChannels.data[0].channel.name,
    description: userChannels.data[0].channel.description,
    id: userChannels.data[0].channel.id,
    public: userChannels.data[0].channel.public,
  });
  const [zoneName, setZoneName] = useState<any>({
    name: userZones?.[0].zone.name,
    description: userZones?.[0].zone.description,
    subdomain: userZones?.[0].zone.subdomain,
    id: userZones?.[0].zone.id,
    public: userZones?.[0].zone.public,
  });

  const [channelPermissions, setChannelPermissions] = useState<any>({
    canInvite: userChannels.data[0].channelRole.canInvite,
    canDelete: userChannels.data[0].channelRole.canDelete,
    canEdit: userChannels.data[0].channelRole.canEdit,
    canManageRole: userChannels.data[0].channelRole.canManageRole,
  });
  const [zonePermissions, setZonePermissions] = useState<any>({
    canInvite: userZones?.[0].zoneRole.canInvite,
    canDelete: userZones?.[0].zoneRole.canDelete,
    canEdit: userZones?.[0].zoneRole.canEdit,
    canManageRole: userZones?.[0].zoneRole.canManageRole,
    canCreateChannel: userZones?.[0].zoneRole.canDelete,
  });

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
          onClick={() => {
            dispatch(changeProfileInfo(userInfo));
          }}
          primary
          label="Save"
          style={{ borderRadius: '10px' }}
          size="large"
          fill="horizontal"
          margin={{ top: 'medium' }}
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
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  gap="small"
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
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  gap="small"
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
                </Box>
              ),
            },

            {
              key: 'email',
              title: 'Email',
              description: 'Your main email address',
              value: user?.email,
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  gap="small"
                  pad="xxsmall"
                >
                  <TextInput value={user?.email} plain focusIndicator={false} />
                </Box>
              ),
            },
            {
              key: 'pasword',
              title: 'Password Change',
              description: 'Change your password',
              component: (
                <Box gap="small">
                  <Box
                    direction="row"
                    justify="between"
                    align="center"
                    gap="small"
                    border={{ size: 'xsmall', color: 'brand' }}
                    round="small"
                    pad="xxsmall"
                  >
                    <TextInput
                      plain
                      type={reveal.current ? 'text' : 'password'}
                      placeholder="Current Password"
                      focusIndicator={false}
                      onChange={() => {}}
                    />
                    <Button
                      icon={
                        reveal.current ? (
                          <View size="medium" />
                        ) : (
                          <Hide size="medium" />
                        )
                      }
                      onClick={() =>
                        setReveal({ ...reveal, current: !reveal.current })
                      }
                    />
                  </Box>
                  <Box
                    direction="row"
                    justify="between"
                    align="center"
                    gap="small"
                    border={{ size: 'xsmall', color: 'brand' }}
                    round="small"
                    pad="xxsmall"
                  >
                    <TextInput
                      plain
                      type={reveal.new ? 'text' : 'password'}
                      placeholder="New Password"
                      focusIndicator={false}
                      onChange={() => {}}
                    />
                    <Button
                      icon={
                        reveal.new ? (
                          <View size="medium" />
                        ) : (
                          <Hide size="medium" />
                        )
                      }
                      onClick={() => setReveal({ ...reveal, new: !reveal.new })}
                    />
                  </Box>
                  <Box
                    direction="row"
                    justify="between"
                    align="center"
                    gap="small"
                    border={{ size: 'xsmall', color: 'brand' }}
                    round="small"
                    pad="xxsmall"
                  >
                    <TextInput
                      plain
                      type={reveal.confirm ? 'text' : 'password'}
                      placeholder="Confirm New Password"
                      focusIndicator={false}
                      onChange={() => {}}
                    />
                    <Button
                      icon={
                        reveal.confirm ? (
                          <View size="medium" />
                        ) : (
                          <Hide size="medium" />
                        )
                      }
                      onClick={() =>
                        setReveal({ ...reveal, confirm: !reveal.confirm })
                      }
                    />
                  </Box>
                </Box>
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
      name: '',
      members: '203',
      whichZone: 'in Car Zone',
      value: channelValue,
      saveButton: (
        <Button
          primary
          label="Save"
          style={{ borderRadius: '10px' }}
          size="large"
          fill="horizontal"
          margin={{ top: 'medium' }}
          onClick={() => {
            dispatch(
              changeChannelInformationAction(channelName.id, channelName)
            );
            dispatch(
              changeChannelPermissionsAction(channelName.id, channelPermissions)
            );
          }}
        />
      ),
      items: [
        {
          key: 'channel1',
          title: 'Channel',
          items: [
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
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    value={channelName.name}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setChannelName({
                        ...channelName,
                        name: event.target.value,
                      })
                    }
                  />
                </Box>
              ),
            },
            {
              key: 'channelTitle',
              title: 'Channel Description',
              description: 'Change channel description',
              value: 'value',
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    value={channelName.description}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setChannelName({
                        ...channelName,
                        description: event.target.value,
                      })
                    }
                  />
                </Box>
              ),
            },

            {
              key: 'usersPermissions',
              title: 'Permissions',
              description: '',
              value: 'value',
              component: (
                <SectionContainer label="User Permissions">
                  <Grid
                    rows={['xxsmall', 'xxsmall']}
                    columns={['medium', 'medium']}
                    gap="small"
                  >
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can edit</Text>
                      <CheckBox
                        checked={channelPermissions.canEdit}
                        onChange={() =>
                          setChannelPermissions({
                            ...channelPermissions,
                            canEdit: !channelPermissions.canEdit,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can delete</Text>
                      <CheckBox
                        checked={channelPermissions.canDelete}
                        onChange={() =>
                          setChannelPermissions({
                            ...channelPermissions,
                            canDelete: !channelPermissions.canDelete,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can invite</Text>
                      <CheckBox
                        checked={channelPermissions.canInvite}
                        onChange={() =>
                          setChannelPermissions({
                            ...channelPermissions,
                            canInvite: !channelPermissions.canInvite,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can manage role</Text>
                      <CheckBox
                        checked={channelPermissions.canManageRole}
                        onChange={() =>
                          setChannelPermissions({
                            ...channelPermissions,
                            canManageRole: !channelPermissions.canManageRole,
                          })
                        }
                      />
                    </Box>
                  </Grid>
                </SectionContainer>
              ),
            },

            {
              key: 'channelPublic',
              title: '',
              description: '',
              value: 'value',
              component: (
                <SectionContainer label="Channel Visibility">
                  <Grid
                    rows={['xxsmall']}
                    columns={['medium', 'medium']}
                    gap="small"
                  >
                    <Box direction="row" justify="between" gap="xsmall">
                      <Text>Public</Text>
                      <CheckBox
                        checked={channelName.public}
                        onChange={() =>
                          setChannelName({
                            ...channelName,
                            public: !channelName.public,
                          })
                        }
                      />
                    </Box>
                  </Grid>
                </SectionContainer>
              ),
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
      saveButton: (
        <Button
          primary
          style={{ borderRadius: '10px' }}
          size="large"
          fill="horizontal"
          margin={{ top: 'medium' }}
          label="Save"
          onClick={() => {
            dispatch(changeZoneInformationAction(zoneName.id, zoneName));
            dispatch(changeZonePermissionsAction(zoneName.id, zonePermissions));
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
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    value={zoneName.name}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setZoneName({
                        ...zoneName,
                        name: event.target.value,
                      })
                    }
                  />
                </Box>
              ),
            },
            {
              key: 'zoneTitle',
              title: 'Zone Subdomain',
              description: 'Change zone subdomain',
              value: 'value',
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    value={zoneName.subdomain}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setZoneName({
                        ...zoneName,
                        subdomain: event.target.value,
                      })
                    }
                  />
                </Box>
              ),
            },
            {
              key: 'zoneDescription',
              title: 'Zone Description',
              description: 'Change zone description',
              value: 'value',
              component: (
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  border={{ size: 'xsmall', color: 'brand' }}
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    value={zoneName.description}
                    plain
                    focusIndicator={false}
                    onChange={(event) =>
                      setZoneName({
                        ...zoneName,
                        description: event.target.value,
                      })
                    }
                  />
                </Box>
              ),
            },

            {
              key: 'zoneManageRole',
              title: 'Permissions',
              description: '',
              value: 'value',
              component: (
                <SectionContainer label="User Permissions">
                  <Grid
                    rows={['xxsmall', 'xxsmall', 'xxsmall']}
                    columns={['medium', 'medium']}
                    gap="small"
                  >
                    <Box
                      align="center"
                      direction="row"
                      gap="xsmall"
                      justify="between"
                    >
                      <Text>Can manage roles</Text>
                      <CheckBox
                        checked={zonePermissions.canManageRole}
                        onChange={() =>
                          setZonePermissions({
                            ...zonePermissions,
                            canManageRole: !zonePermissions.canManageRole,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can edit</Text>
                      <CheckBox
                        checked={zonePermissions.canEdit}
                        onChange={() =>
                          setZonePermissions({
                            ...zonePermissions,
                            canEdit: !zonePermissions.canEdit,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can delete</Text>
                      <CheckBox
                        checked={zonePermissions.canDelete}
                        onChange={() =>
                          setZonePermissions({
                            ...zonePermissions,
                            canDelete: !zonePermissions.canDelete,
                          })
                        }
                      />
                    </Box>

                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can invite</Text>
                      <CheckBox
                        checked={zonePermissions.canInvite}
                        onChange={() =>
                          setZonePermissions({
                            ...zonePermissions,
                            canInvite: !zonePermissions.canInvite,
                          })
                        }
                      />
                    </Box>
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Can create channels</Text>
                      <CheckBox
                        checked={zonePermissions.canCreateChannel}
                        onChange={() =>
                          setZonePermissions({
                            ...zonePermissions,
                            canCreateChannel: !zonePermissions.canCreateChannel,
                          })
                        }
                      />
                    </Box>
                  </Grid>
                </SectionContainer>
              ),
            },
            {
              key: 'zonePublic',
              title: '',
              description: '',
              value: 'value',
              component: (
                <SectionContainer label="Zone Visibility">
                  <Grid
                    rows={['xxsmall']}
                    columns={['medium', 'medium']}
                    gap="small"
                  >
                    <Box
                      align="center"
                      justify="between"
                      direction="row"
                      gap="xsmall"
                    >
                      <Text>Public</Text>
                      <CheckBox
                        checked={zoneName.public}
                        onChange={() =>
                          setZoneName({ ...zoneName, public: !zoneName.public })
                        }
                      />
                    </Box>
                  </Grid>
                </SectionContainer>
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
          id={item.channel.id}
          label={item.channel.name}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
          isEditable
          changeProfilePic={() => {
            setMedium({ name: 'channel', id: item.channel.id });
            setShow(true);
          }}
          medium="channel"
          photoName={item.channel.displayPhoto}
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
          id={item.zone.id}
          label={item.zone.name}
          menuItems={menuItems}
          selectedIndex={selectedIndex}
          isEditable
          medium="zone"
          photoName={item.zone.displayPhoto}
          changeProfilePic={() => {
            setMedium({ name: 'zone', id: item.zone.id });
            setShow(true);
          }}
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

  const getSelectedItems = () => {
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
  };

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
                    <DropButton
                      dropProps={{
                        responsive: false,
                        stretch: false,
                        overflow: { vertical: 'scroll' },
                      }}
                      label={
                        selectedItem.label === 'Channel Settings'
                          ? 'Select Channel'
                          : 'Select Zone'
                      }
                      dropContent={
                        <Box
                          pad="xsmall"
                          background="light-1"
                          gap="small"
                          round="medium"
                        >
                          {dropDownItems(selectedItem.label).map((item) => (
                            <Box
                              border={{ color: 'brand', size: 'medium' }}
                              key={Math.random() * 1000}
                              height={{ min: '120px' }}
                            >
                              <Button
                                onClick={() => {
                                  if (
                                    selectedItem.label === 'Channel Settings'
                                  ) {
                                    setChannelValue(item);
                                    setChannelName({
                                      ...channelName,
                                      name: item.props.label,
                                      id: item.props.id,
                                      description: userChannels.data.filter(
                                        (channel) =>
                                          channel.channel.id === item.props.id
                                      )[0].channel.description,
                                      public: userChannels.data.filter(
                                        (channel) =>
                                          channel.channel.id === item.props.id
                                      )[0].channel.public,
                                    });
                                  } else {
                                    setZoneValue(item);
                                    setZoneName({
                                      ...zoneName,
                                      name: item.props.label,
                                      id: item.props.id,
                                      subdomain: userZones?.filter(
                                        (zone) => zone.id === item.props.id
                                      )[0].zone.subdomain,
                                      public: userZones?.filter(
                                        (zone) => zone.id === item.props.id
                                      )[0].zone.public,
                                      description: userZones?.filter(
                                        (zone) => zone.id === item.props.id
                                      )[0].zone.description,
                                    });
                                  }
                                }}
                              >
                                {item}
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      }
                    />
                  </Box>
                ) : (
                  setting.title === 'Account' && (
                    <AvatarItem
                      label={userInfo.userName}
                      menuItems={menuItems}
                      selectedIndex={0}
                      changeProfilePic={() => {
                        setMedium({ ...medium, name: 'user' });
                        setShow(true);
                      }}
                      isEditable
                      medium="user"
                      photoName={user?.displayPhoto}
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
            {getSelectedItems().map((item) => (
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
                if (medium.name === 'user') {
                  dispatch(
                    changeProfilePicture({ photoFile: value.photoFile[0] })
                  );
                }

                if (medium.name === 'channel') {
                  dispatch(
                    changeChannelPhoto(
                      { photoFile: value.photoFile[0] },
                      medium.id
                    )
                  );
                }
                if (medium.name === 'zone') {
                  dispatch(
                    changeZonePhoto(
                      { photoFile: value.photoFile[0] },
                      medium.id
                    )
                  );
                }
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
                      <Text>{file.name}</Text>
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
              <Box justify="center" direction="row" gap="small">
                <Button
                  label="Cancel"
                  style={{ borderRadius: '10px' }}
                  size="large"
                  fill="horizontal"
                  margin={{ top: 'medium' }}
                  onClick={() => setShow(false)}
                />
                <Button
                  label="Submit"
                  type="submit"
                  primary
                  style={{ borderRadius: '10px' }}
                  size="large"
                  fill="horizontal"
                  margin={{ top: 'medium' }}
                />
              </Box>
            </Form>
          </Box>
        </Layer>
      )}
    </PrivatePageLayout>
  );
};

export default Settings;
