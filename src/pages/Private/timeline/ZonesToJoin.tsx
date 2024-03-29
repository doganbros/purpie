import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import ZoneListItem from '../../../components/utils/zone/ZoneListItem';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';

import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

const ZonesToJoin: FC = () => {
  const { t } = useTranslation();
  const {
    activity: { zoneSuggestions },
  } = useSelector((state: AppState) => state);

  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);

  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          {t('ZonesToJoin.title')}
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
                ? t('common.seeMore')
                : t('common.seeLess')}
            </Text>
          </Button>
        )}
      </Box>

      {zoneSuggestions.loading && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
      )}

      {!zoneSuggestions.loading &&
        (zoneSuggestions.data.length === 0 ? (
          <Text size="small" color="brand" weight={500}>
            {t('ZonesToJoin.noZonesFound')}
          </Text>
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
                displayPhoto={z.zone_displayPhoto}
              />
            ))
        ))}

      {displayCount > SUGGESTION_AMOUNT_LESS && (
        <Button alignSelf="end">
          <Text size="small" color="brand">
            {t('common.seeAll')}
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default ZonesToJoin;
