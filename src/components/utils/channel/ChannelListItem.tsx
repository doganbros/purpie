import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinChannelAction } from '../../../store/actions/channel.action';
import InitialsAvatar from '../InitialsAvatar';

interface ChannelListItemProps {
  id: number;
  zoneSubdomain: string;
  name: string;
}

const ChannelListItem: FC<ChannelListItemProps> = ({
  id,
  name,
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
        <InitialsAvatar id={id} value={name} />
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
        label={isFollowing ? 'Following' : 'Follow'}
        size="small"
      />
    </Box>
  );
};

export default ChannelListItem;
