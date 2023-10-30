import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../store/reducers/root.reducer';
import { UserChannelListItem } from '../store/types/channel.types';

export const useSelectedChannel = (): UserChannelListItem | undefined => {
  const {
    channel: { selectedChannelId, userChannels },
  } = useSelector((state: AppState) => state);

  return useMemo(() => {
    if (selectedChannelId) {
      return userChannels.data.find(
        (uChannel) => uChannel.channel.id === selectedChannelId
      );
    }
    return undefined;
  }, [selectedChannelId, userChannels]);
};
