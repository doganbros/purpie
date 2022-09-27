import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GradientScroll from '../../../components/utils/GradientScroll';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { listUserPublicChannelsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';

const UserPublicChannels: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const {
    user: { publicChannels },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(listUserPublicChannelsAction(userName));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        Channels Subscribed To
      </Text>
      {publicChannels.loading && <Text size="small">Loading</Text>}
      {!publicChannels.loading && publicChannels.data.length === 0 ? (
        <Text size="small">No channels found</Text>
      ) : (
        <GradientScroll>
          <Box direction="row" gap="medium">
            {publicChannels.data.map(({ channel }) => (
              <Box key={channel.id} gap="small" align="center">
                <InitialsAvatar id={channel.id} value={channel.name} />
                <Box align="center">
                  <Text size="small">{channel.name}</Text>
                </Box>
              </Box>
            ))}
          </Box>
        </GradientScroll>
      )}
    </Box>
  );
};

export default UserPublicChannels;
