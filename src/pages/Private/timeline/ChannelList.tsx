import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import UnselectedChannelListItem from './UnselectedChannelListItem';
import SelectedChannelListItem from './SelectedChannelListItem';
import { UserChannelListItem } from '../../../store/types/channel.types';

interface ChannelListProps {
  handleWaiting?: () => void;
}

const ChannelList: FC<ChannelListProps> = ({
  handleWaiting,
}: ChannelListProps) => {
  const { t } = useTranslation();
  const {
    channel: { selectedChannelId, userChannels },
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
  const getZoneName = (channelInfo: UserChannelListItem) => {
    const { zoneId } = channelInfo?.channel || {};
    if (getUserZones?.userZones) {
      const foundZone = getUserZones.userZones.find(
        (zone) => zone?.zone?.id === zoneId
      );
      return foundZone?.zone?.name || '';
    }
    return '';
  };

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
            selectedChannelId === c.channel.id ? (
              <SelectedChannelListItem
                key={c.channel.id}
                c={c}
                handleWaiting={handleWaiting}
                zoneName={getZoneName(c)}
              />
            ) : (
              <UnselectedChannelListItem
                key={c.channel.id}
                c={c}
                handleWaiting={handleWaiting}
                zoneName={getZoneName(c)}
              />
            )
          )
        ))}
    </Box>
  );
};

export default ChannelList;
