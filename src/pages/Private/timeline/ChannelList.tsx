import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  setSelectedChannelAction,
  unsetSelectedChannelAction,
} from '../../../store/actions/channel.action';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';

const ChannelList: FC = () => {
  const dispatch = useDispatch();
  const {
    channel: { selectedChannel, userChannels },
    zone: { selectedUserZone },
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
              <InitialsAvatar id={c.channel.id} value={c.channel.name} />
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
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ChannelList;
