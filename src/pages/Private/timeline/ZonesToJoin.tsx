import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getZoneSuggestionsAction } from '../../../store/actions/activity.action';
import ZoneListItem from '../../../components/utils/zone/ZoneListItem';
import { zoneAvatarSrc } from './data/zone-avatars';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';

const ZonesToJoin: FC = () => {
  const dispatch = useDispatch();
  const {
    activity: { zoneSuggestions },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getZoneSuggestionsAction(SUGGESTION_AMOUNT_MORE, 0));
  }, []);

  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Zones to join
        </Text>
        {zoneSuggestions.data.length > SUGGESTION_AMOUNT_LESS && (
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

      {zoneSuggestions.loading && <Text size="small">Loading</Text>}

      {!zoneSuggestions.loading &&
        (zoneSuggestions.data.length === 0 ? (
          <Text size="small">No zones found</Text>
        ) : (
          zoneSuggestions.data
            .slice(0, displayCount)
            .map((z) => (
              <ZoneListItem
                key={z.zone_id}
                id={z.zone_id}
                name={z.zone_name}
                channelCount={+z.zone_channelCount}
                memberCount={+z.zone_membersCount}
                src={zoneAvatarSrc[z.zone_id % zoneAvatarSrc.length]}
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

export default ZonesToJoin;
