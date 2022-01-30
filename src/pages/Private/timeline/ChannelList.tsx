import React, { FC, useEffect } from 'react';
import { Avatar, Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  getUserChannelsAction,
  setSelectedChannelAction,
  unsetSelectedChannelAction,
} from '../../../store/actions/channel.action';
import { channelAvatarSrc } from './data/channel-avatars';

const ChannelList: FC = () => {
  const dispatch = useDispatch();
  const {
    channel: { selectedChannel, userChannels },
    zone: { selectedUserZone },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getUserChannelsAction());
  }, []);

  const userChannelsFiltered: typeof userChannels = selectedUserZone
    ? {
        ...userChannels,
        data: userChannels.data.filter(
          (c) => c.channel.zoneId === selectedUserZone.zone.id
        ),
      }
    : userChannels;

  return (
    <Box fill direction="row" align="center">
      {userChannelsFiltered.loading && <Text size="small">Loading</Text>}
      {!userChannelsFiltered.loading &&
        (userChannelsFiltered.data.length === 0 ? (
          <Text size="small">
            No channels are followed{selectedUserZone ? ' on this zone' : ''}
          </Text>
        ) : (
          userChannelsFiltered.data.map((c) => (
            <Box
              onClick={() => {
                if (c.channel.id === selectedChannel?.channel.id)
                  dispatch(unsetSelectedChannelAction());
                else dispatch(setSelectedChannelAction(c));
              }}
              focusIndicator={false}
              key={c.channel.id}
              align="center"
              flex={{ shrink: 0 }}
              round="small"
              pad="small"
              background={
                selectedChannel?.channel.id === c.channel.id ? 'brand' : ''
              }
            >
              <Avatar
                size="medium"
                src={channelAvatarSrc[c.channel.id % channelAvatarSrc.length]}
              />
              <Text
                size="small"
                color={
                  c.channel.id === selectedChannel?.channel.id
                    ? 'light-1'
                    : 'dark'
                }
              >
                {c.channel.name}
              </Text>
              <Text
                size="xsmall"
                color={
                  c.channel.id === selectedChannel?.channel.id
                    ? 'light-2'
                    : 'dark-1'
                }
              >
                {c.channel.topic}
              </Text>
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ChannelList;
