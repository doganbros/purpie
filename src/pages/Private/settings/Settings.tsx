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
  DropButton,
} from 'grommet';
import { CaretRightFill, Search } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { useDebouncer } from '../../../hooks/useDebouncer';
import ModifiedAccordionPanel from '../../../components/utils/ModifiedAccordionPanel';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { AppState } from '../../../store/reducers/root.reducer';
import { AvatarItem } from './AvatarItem';
import { changeProfilePicture } from '../../../store/actions/auth.action';
import { changeChannelPhoto } from '../../../store/actions/channel.action';
import { changeZonePhoto } from '../../../store/actions/zone.action';
import {
  ChannelSettingsData,
  MediumType,
  PersonalSettingsData,
  UserInfo,
  ZoneSettingsData,
} from './types';
import ChannelSettings from './ChannelSettings';
import ZoneSettings from './ZoneSettings';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import PersonalSettings from './PersonalSettings';
import { UpdateZonePayload } from '../../../store/types/zone.types';

const Settings: FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [searchText, setSearchText] = useState<string>('');
  const [searchTextValue, setSearchTextValue] = useState<string>('');

  const [show, setShow] = useState(false);
  const [imgSrc, setImgSrc] = useState<any>(null);

  const [medium, setMedium] = useState<MediumType>({
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

  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>({
    name: userChannels.data[0].channel.name,
    description: userChannels.data[0].channel.description,
    topic: userChannels.data[0].channel.topic,
    id: userChannels.data[0].channel.id,
    public: userChannels.data[0].channel.public,
  });

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>({
    name: userZones?.[0].zone.name || '',
    description: userZones?.[0].zone.description || '',
    subdomain: userZones?.[0].zone.subdomain || '',
    id: userZones?.[0].zone.id || 0,
    public: userZones?.[0].zone.public || false,
  });

  const [userInfo, setUserInfo] = useState<UserInfo>({
    userName: user?.userName || '',
    fullName: user?.fullName || '',
  });
  const dispatch = useDispatch();

  const data: (
    | ChannelSettingsData
    | PersonalSettingsData
    | ZoneSettingsData
  )[] = [
    PersonalSettings({ onSave: () => {}, userInfo, setUserInfo }),
    ChannelSettings({
      onSave: () => {},
      channelPayload,
      onChange: setChannelPayload,
    }),
    ZoneSettings({ onSave: () => {}, zonePayload, onChange: setZonePayload }),
  ].filter(
    (v): v is ChannelSettingsData | PersonalSettingsData | ZoneSettingsData =>
      v !== null
  );
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
        const result: (
          | ChannelSettingsData
          | PersonalSettingsData
          | ZoneSettingsData
        )[] = [];
        for (let i = 0; i < data.length; i++) {
          const menuItem:
            | ChannelSettingsData
            | PersonalSettingsData
            | ZoneSettingsData = data[i];
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

  const renderSettings = (
    selectedItem: ChannelSettingsData | PersonalSettingsData | ZoneSettingsData
  ) => {
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
                                  if ('whichZone' in selectedItem) {
                                    setChannelPayload({
                                      name: item.props.label,
                                      id: item.props.id,
                                      description: userChannels.data.filter(
                                        (channel) =>
                                          channel.channel.id === item.props.id
                                      )[0].channel.description,
                                      topic: userChannels.data.filter(
                                        (channel) =>
                                          channel.channel.id === item.props.id
                                      )[0].channel.topic,
                                      public: userChannels.data.filter(
                                        (channel) =>
                                          channel.channel.id === item.props.id
                                      )[0].channel.public,
                                    });
                                  } else {
                                    setZonePayload({
                                      name: item.props.label,
                                      id: item.props.id,
                                      subdomain:
                                        userZones?.filter(
                                          (zone) => zone.id === item.props.id
                                        )[0].zone.subdomain || '',
                                      public: !!userZones?.filter(
                                        (zone) => zone.id === item.props.id
                                      )[0].zone.public,
                                      description:
                                        userZones?.filter(
                                          (zone) => zone.id === item.props.id
                                        )[0].zone.description || '',
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
                <Button
                  onClick={selectedItem.onSave}
                  primary
                  label="Save"
                  style={{ borderRadius: '10px' }}
                  size="large"
                  fill="horizontal"
                  margin={{ top: 'medium' }}
                />
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
