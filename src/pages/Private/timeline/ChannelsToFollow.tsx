import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import ChannelListItem from '../../../components/utils/channel/ChannelListItem';
import { AppState } from '../../../store/reducers/root.reducer';
import { channelAvatarSrc } from './data/channel-avatars';
import { getChannelSuggestionsAction } from '../../../store/actions/activity.action';

const ChannelsToFollow: FC = () => {
  const dispatch = useDispatch();
  const {
    activity: { channelSuggestions },
  } = useSelector((state: AppState) => state);
  const [displayCount, setDisplayCount] = useState(3);

  useEffect(() => {
    dispatch(getChannelSuggestionsAction(10, 0));
  }, []);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Channels to follow
        </Text>
        {channelSuggestions.data.length > 3 && (
          <Button
            onClick={() => {
              setDisplayCount((ps) => (ps === 3 ? 10 : 3));
            }}
          >
            <Text size="small" color="brand">
              {displayCount === 3 ? 'See more' : 'See less'}
            </Text>
          </Button>
        )}
      </Box>
      {channelSuggestions.loading && <Text size="small">Loading</Text>}
      {!channelSuggestions.loading &&
        (channelSuggestions.data.length === 0 ? (
          <Text size="small">No channels found</Text>
        ) : (
          channelSuggestions.data
            .slice(0, displayCount)
            .map((c, i) => (
              <ChannelListItem
                key={c.channel_id}
                id={c.channel_id}
                name={c.channel_name}
                src={channelAvatarSrc[i % channelAvatarSrc.length]}
              />
            ))
        ))}

      {displayCount > 3 && (
        <Button alignSelf="end">
          <Text size="small" color="brand">
            See all
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default ChannelsToFollow;
