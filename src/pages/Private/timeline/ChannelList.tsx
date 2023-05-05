/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  setSelectedChannelAction,
  unsetSelectedChannelAction,
} from '../../../store/actions/channel.action';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import UnselectedChannelListItem from './UnselectedChannelListItem';
import SelectedChannelListItem from './SelectedChannelListItem';

interface ChannelListProps {
  handleWaiting?: () => void;
}

const ChannelList: FC<ChannelListProps> = ({
  handleWaiting,
}: ChannelListProps) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    channel: { selectedChannel, userChannels },
    zone: { selectedUserZone, getUserZones },
  } = useSelector((state: AppState) => state);

  const userChannelsFiltered: typeof userChannels = selectedUserZone
    ? {
        ...userChannels,
        data: userChannels.data.filter(
          (c) => c.channel.zoneId === selectedUserZone.zone.id
        ),
      }
    : userChannels;

  return (
    <Box direction="row" gap="small">
      {userChannelsFiltered.loading && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
      )}
      {!userChannelsFiltered.loading &&
        (userChannelsFiltered.data.length === 0 ? (
          <Text size="small">
            {t('ChannelList.noFollowedChannel', {
              zone: selectedUserZone ? t('ChannelList.onThisZone') : '',
            })}
          </Text>
        ) : (
          userChannelsFiltered.data.map((c) =>
            selectedChannel?.channel.id === c.channel.id ? (
              <SelectedChannelListItem
                key={c.channel.id}
                c={c}
                handleWaiting={handleWaiting}
                zoneName="test"
              />
            ) : (
              <UnselectedChannelListItem
                key={c.channel.id}
                c={c}
                handleWaiting={handleWaiting}
                zoneName="test"
              />
            )
          )
        ))}
    </Box>
  );
};

export default ChannelList;
