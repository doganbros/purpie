import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';
import ChannelUserListItem from '../../../components/utils/channel/ChannelUserListItem';
import { listChannelUsersAction } from '../../../store/actions/channel.action';

interface ChannelMembersProps {
  channelId: string;
}

const ChannelMembers: FC<ChannelMembersProps> = ({ channelId }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    channel: { channelUsers },
  } = useSelector((state: AppState) => state);

  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);

  useEffect(() => {
    dispatch(listChannelUsersAction(channelId, SUGGESTION_AMOUNT_MORE, 0));
  }, []);

  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight="bold">
          {t('ChannelMembers.title')}
        </Text>
        {channelUsers?.data?.length > SUGGESTION_AMOUNT_LESS && (
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
      {channelUsers?.loading && <Text size="small">Loading</Text>}
      {!channelUsers?.loading &&
        (channelUsers?.data?.length === 0 ? (
          <Text size="small">{t('ChannelMembers.noMembersFound')}</Text>
        ) : (
          channelUsers?.data
            ?.slice(0, displayCount)
            .map((c) => (
              <ChannelUserListItem
                key={c.id}
                id={c.user.id}
                userName={c.user.userName}
                name={c.user.fullName}
                displayPhoto={c.user.displayPhoto}
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
  return null;
};

export default ChannelMembers;
