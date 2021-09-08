import React, { FC, useEffect } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getUserChannelsAction } from '../../../store/actions/channel.action';
import { channelAvatarSrc } from './data/channel-avatars';

const ChannelList: FC = () => {
  const dispatch = useDispatch();
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getUserChannelsAction());
  }, []);

  return (
    <Box
      fill
      direction="row"
      align="center"
      gap="medium"
      pad={{ horizontal: 'small' }}
    >
      {userChannels.loading && <Text size="small">Loading</Text>}
      {!userChannels.loading &&
        (userChannels.data.length === 0 ? (
          <Text size="small">No channels are followed</Text>
        ) : (
          userChannels.data.map((c) => (
            <Box key={c.channel.id} align="center">
              <Avatar
                size="medium"
                src={channelAvatarSrc[c.channel.id % channelAvatarSrc.length]}
              />
              <Text size="small">{c.channel.name}</Text>
              <Text size="xsmall" color="dark-1">
                {c.channel.topic}
              </Text>
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ChannelList;
