import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getZoneSuggestionsAction } from '../../../store/actions/activity.action';
import ZoneListItem from '../../../components/utils/zone/ZoneListItem';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';
import { useTranslate } from '../../../hooks/useTranslate';

const ZonesToJoin: FC = () => {
  const dispatch = useDispatch();
  const t = useTranslate('ZonesToJoin');
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
          {t('title')}
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
                ? t('seeMore', true)
                : t('seeLess', true)}
            </Text>
          </Button>
        )}
      </Box>

      {zoneSuggestions.loading && (
        <Text size="small">{t('loading', true)}</Text>
      )}

      {!zoneSuggestions.loading &&
        (zoneSuggestions.data.length === 0 ? (
          <Text size="small">{t('noZonesFound')}</Text>
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
              />
            ))
        ))}

      {displayCount > SUGGESTION_AMOUNT_LESS && (
        <Button alignSelf="end">
          <Text size="small" color="brand">
            {t('seeAll', true)}
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default ZonesToJoin;
