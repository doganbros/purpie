import React, { FC, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import ChannelListItem from '../../../components/utils/channel/ChannelListItem';
import { AppState } from '../../../store/reducers/root.reducer';

import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';

const ChannelsToFollow: FC = () => {
  const { t } = useTranslation();
  const {
    activity: { channelSuggestions },
  } = useSelector((state: AppState) => state);
  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);

  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          {t('ChannelsToFollow.title')}
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
                ? t('common.seeMore')
                : t('common.seeLess')}
            </Text>
          </Button>
        )}
      </Box>
      {channelSuggestions.loading && <Text size="small">Loading</Text>}
      {!channelSuggestions.loading &&
        (channelSuggestions.data.length === 0 ? (
          <Text size="small" color="brand" weight={500}>
            {t('ChannelsToFollow.noChannelsFound')}
          </Text>
        ) : (
          channelSuggestions.data
            .slice(0, displayCount)
            .map((c) => (
              <ChannelListItem
                key={c.channel_id}
                id={c.channel_id}
                zoneSubdomain={c.zone_subdomain}
                name={c.channel_name}
                displayPhoto={c.channel_displayPhoto}
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

export default ChannelsToFollow;
