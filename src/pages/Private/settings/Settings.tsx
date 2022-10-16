import React, { FC, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  DropButton,
  FileInput,
  Form,
  FormField,
  Image,
  Layer,
  Text,
} from 'grommet';
import { CaretRightFill } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LogoWhite from '../../../assets/octopus-logo/logo-white.svg';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { changeProfilePicture } from '../../../store/actions/auth.action';
import { changeChannelPhoto } from '../../../store/actions/channel.action';
import { changeZonePhoto } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateChannelPayload } from '../../../store/types/channel.types';
import { UpdateZonePayload } from '../../../store/types/zone.types';
import { AvatarItem } from './AvatarItem';
import ChannelSettings from './ChannelSettings';
import PersonalSettings from './PersonalSettings';
import {
  ChannelSettingsData,
  MediumType,
  PersonalSettingsData,
  SettingFormItem,
  UserInfo,
  ZoneSettingsData,
} from './types';
import ZoneSettings from './ZoneSettings';
import SearchBar from './SearchBar';

const Settings: FC = () => {
  const history = useHistory();
  const [activeAccordionIndex, setActiveAccordionIndex] = useState(0);
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

  const getSearchResults = () => {
    if (data.length > 0) {
      const result: (
        | ChannelSettingsData
        | PersonalSettingsData
        | ZoneSettingsData
      )[] = [];
      data.forEach((menuItem) => {
        const menuItemKey = menuItem.key.replace(/ /g, '').toLowerCase();
        const menuItemLabel = menuItem.label.replace(/ /g, '').toLowerCase();
        const search = searchText.replace(/ /g, '').toLowerCase();
        if (menuItemKey.includes(search) || menuItemLabel.includes(search)) {
          result.push(menuItem);
        } else {
          const menuItemsResult: SettingFormItem[] = [];
          menuItem.items.forEach((settingItem) => {
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

  const renderSettingCategory = (
    selectedItem: ChannelSettingsData | PersonalSettingsData | ZoneSettingsData
  ) => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }}>
        {searchText.length === 0 && (
          <Box>
            <Text size="xlarge">{selectedItem.label}</Text>
          </Box>
        )}

        {!('role' in selectedItem) ? (
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
        )}
        {selectedItem.items.map<React.ReactNode>((setting) => {
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
              pad="small"
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
        <Button
          onClick={selectedItem.onSave}
          primary
          label="Save"
          style={{ borderRadius: '10px' }}
          size="large"
          fill="horizontal"
          margin={{ top: 'medium' }}
        />
      </Box>
    );
  };

  const renderSettings = () => {
    if (searchText?.length > 0) {
      const selectedItems = getSearchResults();
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
    <Box flex={{ grow: 1 }} background="brand" height={{ min: '100vh' }}>
      <Box flex={{ grow: 1 }}>
        <Box direction="row" gap="large" pad="medium" align="center">
          <Box onClick={() => history.push('/')}>
            <Avatar size="large" round="0" src={LogoWhite} />
          </Box>
          <Box flex={{ grow: 1 }}>
            <SearchBar value={searchText} onChange={setSearchText} />
          </Box>
        </Box>
        <Box direction="row" pad={{ horizontal: 'medium', bottom: 'medium' }}>
          <Box>
            {data.map<React.ReactNode>((menuItem, index) => (
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
                    weight={index === selectedIndex ? 'bold' : 'normal'}
                    color="white"
                  >
                    {menuItem.label}
                  </Text>
                  <CaretRightFill color="white" />
                </Box>
                <Divider color="white" />
              </React.Fragment>
            ))}
          </Box>
          <Box flex="grow" background="white" round="medium" pad="medium">
            {renderSettings()}
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
    </Box>
  );
};

export default Settings;
