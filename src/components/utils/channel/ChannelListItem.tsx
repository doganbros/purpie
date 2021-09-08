import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinChannelAction } from '../../../store/actions/channel.action';

interface ChannelListItemProps {
  id: number;
  zoneSubdomain: string;
  name: string;
  src: string;
}

const ChannelListItem: FC<ChannelListItemProps> = ({
  id,
  name,
  src,
  zoneSubdomain,
}) => {
  const dispatch = useDispatch();
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  const isFollowing =
    userChannels.data.filter((c) => c.channel.id === id).length > 0;

  return (
    <Box direction="row" justify="between" align="center">
      <Box direction="row" align="center" gap="small">
        <Avatar size="medium" src={src} />
        <Box>
          <Text size="small" weight="bold">
            {name}
          </Text>
          <Text size="xsmall" color="status-disabled">
            {zoneSubdomain}
          </Text>
        </Box>
      </Box>
      <Button
        primary={!isFollowing}
        onClick={() => {
          dispatch(joinChannelAction(id));
        }}
        disabled={isFollowing}
        label={isFollowing ? 'Joined' : 'Join'}
        size="small"
      />
    </Box>
  );
};

export default ChannelListItem;
