import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinChannelAction } from '../../../store/actions/channel.action';
import EllipsesOverflowText from '../EllipsesOverflowText';
import { ChannelAvatar } from '../Avatars/ChannelAvatar';

interface ChannelListItemProps {
  id: string;
  zoneSubdomain: string;
  name: string;
  displayPhoto: string;
}

const ChannelListItem: FC<ChannelListItemProps> = ({
  id,
  name,
  zoneSubdomain,
  displayPhoto,
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
        <ChannelAvatar id={id} name={name} src={displayPhoto} />
        <Box>
          <EllipsesOverflowText
            maxWidth="212px"
            lineClamp={1}
            size="small"
            weight="bold"
          >
            {name}
          </EllipsesOverflowText>
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
        label={t(isFollowing ? 'common.following' : 'common.follow')}
        size="small"
      />
    </Box>
  );
};

export default ChannelListItem;
