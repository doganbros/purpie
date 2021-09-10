import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import ChannelListItem from '../../../components/utils/channel/ChannelListItem';
import { AppState } from '../../../store/reducers/root.reducer';
import { channelAvatarSrc } from './data/channel-avatars';
import { getChannelSuggestionsAction } from '../../../store/actions/activity.action';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';

const ChannelsToFollow: FC = () => {
  const dispatch = useDispatch();
  const {
    activity: { channelSuggestions },
  } = useSelector((state: AppState) => state);
  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);

  useEffect(() => {
    dispatch(getChannelSuggestionsAction(SUGGESTION_AMOUNT_MORE, 0));
  }, []);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Channels to follow
        </Text>
        {channelSuggestions.data.length > SUGGESTION_AMOUNT_LESS && (
          <Button
            onClick={() => {
              setDisplayCount((ps) =>
                ps === SUGGESTION_AMOUNT_LESS
                  ? SUGGESTION_AMOUNT_MORE
                  : SUGGESTION_AMOUNT_LESS
              );
            }}
          >
            <Text size="small" color="brand">
              {displayCount === SUGGESTION_AMOUNT_LESS
                ? 'See more'
                : 'See less'}
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
            .map((c) => (
              <ChannelListItem
                key={c.channel_id}
                id={c.channel_id}
                zoneSubdomain={c.zone_subdomain}
                name={c.channel_name}
                src={channelAvatarSrc[c.channel_id % channelAvatarSrc.length]}
              />
            ))
        ))}

      {displayCount > SUGGESTION_AMOUNT_LESS && (
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
