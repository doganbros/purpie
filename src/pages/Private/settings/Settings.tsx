import React, { FC, useEffect, useState } from 'react';
import {
  Accordion,
  AccordionPanel,
  Avatar,
  Box,
  Button,
  FileInput,
  Form,
  FormField,
  Image,
  Layer,
  Text,
} from 'grommet';
import { CaretRightFill } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LogoWhite from '../../../assets/octopus-logo/logo-white.svg';
import Divider from '../../../components/layouts/PrivatePageLayout/ZoneSelector/Divider';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { changeProfilePicture } from '../../../store/actions/auth.action';
import { changeChannelPhoto } from '../../../store/actions/channel.action';
import { changeZonePhoto } from '../../../store/actions/zone.action';
import ChannelSettings from './ChannelSettings';
import PersonalSettings from './PersonalSettings';
import SearchBar from './SearchBar';
import { MediumType, SettingFormItem, SettingsData } from './types';
import ZoneSettings from './ZoneSettings';

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

  const dispatch = useDispatch();

  const data: SettingsData[] = [
    PersonalSettings({
      onSave: () => {},
      onChangeProfilePicture: () => {
        setMedium({ ...medium, name: 'user' });
        setShow(true);
      },
    }),
    ChannelSettings({
      onSave: () => {},
      onChangeProfilePicture: (item) => {
        setMedium({ name: 'channel', id: item.channel.id });
        setShow(true);
      },
    }),
    ZoneSettings({
      onSave: () => {},
      onChangeProfilePicture: (item) => {
        setMedium({ name: 'zone', id: item.zone.id });
        setShow(true);
      },
    }),
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

  const renderSettingCategory = (selectedItem: SettingsData) => {
    return (
      <Box flex="grow" pad={{ horizontal: 'small' }} gap="medium">
        {searchText.length === 0 && (
          <Box>
            <Text size="xlarge">{selectedItem.label}</Text>
          </Box>
        )}
        {selectedItem.avatarWidget}
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
