import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  const isFollowing =
    userChannels.data.filter((c) => c.channel.id === id).length > 0;

  return (
    <Box direction="row" justify="between" align="center">
      <Box direction="row" align="center" gap="small">
        <InitialsAvatar id={id} value={name} />
        <Box width="small">
          <Text size="small" weight="bold" truncate="tip">
            {name}
          </Text>
          <Text size="xsmall" color="status-disabled" truncate="tip">
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
        label={t(isFollowing ? 'common.following' : 'common.follow')}
        size="small"
      />
    </Box>
  );
};

export default ChannelListItem;
