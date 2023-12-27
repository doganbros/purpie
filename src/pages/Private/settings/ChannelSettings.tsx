import React, { useEffect, useState } from 'react';
import { Box, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { getUserChannelsAllAction } from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  UpdateChannelPayload,
  UserChannelListItem,
} from '../../../store/types/channel.types';
import ChannelPermissions from '../../../layers/settings-and-static-pages/channel/ChannelPermissions';
import ChannelUsers from '../../../layers/settings-and-static-pages/channel/ChannelUsers';
import './Style.scss';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import ChannelSettingsHeader from '../../../layers/settings-and-static-pages/channel/ChannelSettingsHeader';
import ChannelSettingsActions from '../../../layers/settings-and-static-pages/channel/ChannelSettingsActions';

const initialChannelPayload = {
  name: '',
  description: '',
  id: '',
  public: false,
};

interface LocationState {
  selectedChannel: UserChannelListItem | null;
  showChannelSelector: boolean;
}

const ChannelSettings = (): Menu => {
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const { state }: { state: LocationState } = useLocation();

  const { selectedChannel: channelShortSelected } = (state ||
    {}) as LocationState;

  const [
    selectedUserChannel,
    setSelectedUserChannel,
  ] = useState<UserChannelListItem | null>(channelShortSelected || null);

  const [channelPayload, setChannelPayload] = useState<UpdateChannelPayload>(
    initialChannelPayload
  );

  const { t } = useTranslation();

  useEffect(() => {
    dispatch(getUserChannelsAllAction());
  }, []);

  useEffect(() => {
    if (selectedUserChannel)
      setChannelPayload({
        name: selectedUserChannel.channel.name,
        id: selectedUserChannel.channel.id,
        description: selectedUserChannel.channel.description,
        public: selectedUserChannel.channel.public,
      });
    else setChannelPayload(initialChannelPayload);
  }, [selectedUserChannel]);

  const channelSettings: Menu = {
    key: 'channel',
    label: t('settings.channelSettings'),
    url: 'channel',
  };

  if (userChannels.data.length === 0) {
    channelSettings.items = [
      {
        key: 'noChannel',
        label: '',

        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            round="small"
            pad="xxsmall"
          >
            <Text> {t('settings.noChannel')}</Text>
          </Box>
        ),
      },
    ];
    return channelSettings;
  }

  channelSettings.header = (
    <ChannelSettingsHeader
      selectedUserChannel={selectedUserChannel}
      setSelectedUserChannel={setSelectedUserChannel}
    />
  );

  channelSettings.action = (
    <ChannelSettingsActions
      selectedUserChannel={selectedUserChannel}
      setSelectedUserChannel={setSelectedUserChannel}
      channelPayload={channelPayload}
    />
  );

  channelSettings.tabs = [{ index: 1, label: t('settings.general') }];
  channelSettings.items = [
    {
      key: 'channelName',
      label: t('settings.channelName'),
      tabIndex: 1,
      component: (
        <Box
          direction="row"
          justify="between"
          align="center"
          gap="small"
          border={{ size: 'xsmall', color: 'brand' }}
          round="small"
          pad="xxsmall"
          className="z-index--1"
        >
          <TextInput
            disabled={!selectedUserChannel?.channelRole.canEdit}
            placeholder={t('settings.channelNamePlaceholder')}
            value={channelPayload.name}
            plain
            focusIndicator={false}
            onChange={(event) => {
              setChannelPayload({
                ...channelPayload,
                name: event.target.value,
              });
            }}
          />
        </Box>
      ),
    },
    {
      key: 'channelTitle',
      label: t('settings.channelDescription'),
      tabIndex: 1,
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
            disabled={!selectedUserChannel?.channelRole.canEdit}
            placeholder={t('settings.channelDescriptionPlaceholder')}
            value={channelPayload.description || ''}
            plain
            focusIndicator={false}
            onChange={(event) => {
              setChannelPayload({
                ...channelPayload,
                description: event.target.value,
              });
            }}
          />
        </Box>
      ),
    },
  ];

  if (selectedUserChannel?.channelRole?.canManageRole) {
    channelSettings.tabs.push({ index: 2, label: t('settings.permissions') });
    channelSettings.items.push({
      key: 'channelPermissions',
      label: '',
      tabIndex: 2,
      componentFunc: (search?: string) => (
        <ChannelPermissions
          userChannel={selectedUserChannel}
          searchText={search}
        />
      ),
      searchableTexts: [
        t('ChannelPermissionAction.canInvite'),
        t('ChannelPermissionAction.canDelete'),
        t('ChannelPermissionAction.canEdit'),
        t('ChannelPermissionAction.canManageRole'),
      ],
    });
    channelSettings.tabs.push({ index: 3, label: t('settings.followers') });
    channelSettings.items.push({
      key: 'channelFollowers',
      label: '',
      tabIndex: 3,
      component: <ChannelUsers channelId={selectedUserChannel.channel.id} />,
    });
  }

  return channelSettings;
};

export default ChannelSettings;
