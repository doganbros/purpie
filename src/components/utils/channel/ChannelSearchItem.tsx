import { Box, Button, Text } from 'grommet';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { joinChannelAction } from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ChannelListItem } from '../../../store/types/channel.types';
import { ChannelAvatar } from '../Avatars/ChannelAvatar';

interface ChannelSearchItemProps {
  channel: ChannelListItem;
}

const ChannelSearchItem: FC<ChannelSearchItemProps> = ({ channel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    channel: {
      userChannels: { data },
    },
  } = useSelector((state: AppState) => state);

  const isFollowing = (id: string) => !!data.find((c) => c.channel.id === id);

  return (
    <Box direction="row" align="center" gap="small" key={channel.id}>
      <Box flex={{ shrink: 0 }}>
        <ChannelAvatar
          name={channel.name}
          id={channel.id}
          src={channel.displayPhoto}
        />
      </Box>
      <Box fill align="end" direction="row" gap="small">
        <Text color="brand" weight="bold">
          {channel.name}
        </Text>
        <Text color="status-disabled" size="small">
          {channel.description}
        </Text>
      </Box>
      <Button
        disabled={isFollowing(channel.id)}
        onClick={() => dispatch(joinChannelAction(channel.id))}
        primary
        label={
          isFollowing(channel.id) ? t('common.following') : t('common.follow')
        }
      />
    </Box>
  );
};

export default ChannelSearchItem;
