import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getZoneSuggestionsAction } from '../../../store/actions/activity.action';
import ZoneListItem from '../../../components/utils/zone/ZoneListItem';
import { zoneAvatarSrc } from './data/zone-avatars';

const ZonesToJoin: FC = () => {
  const dispatch = useDispatch();
  const {
    activity: { zoneSuggestions },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getZoneSuggestionsAction(10, 0));
  }, []);

  const [displayCount, setDisplayCount] = useState(3);
  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          Zones to join
        </Text>
        {zoneSuggestions.data.length > 3 && (
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

      {zoneSuggestions.loading && <Text size="small">Loading</Text>}

      {!zoneSuggestions.loading &&
        (zoneSuggestions.data.length === 0 ? (
          <Text size="small">No zones found</Text>
        ) : (
          zoneSuggestions.data
            .slice(0, displayCount)
            .map((z, i) => (
              <ZoneListItem
                key={z.zone_id}
                id={z.zone_id}
                name={z.zone_name}
                channelCount={+z.zone_channelCount}
                memberCount={+z.zone_membersCount}
                src={zoneAvatarSrc[i % zoneAvatarSrc.length]}
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

export default ZonesToJoin;
