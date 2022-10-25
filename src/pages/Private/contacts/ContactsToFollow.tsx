import React, { FC, useEffect, useState } from 'react';
import { Box, Button, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  SUGGESTION_AMOUNT_LESS,
  SUGGESTION_AMOUNT_MORE,
} from '../../../helpers/constants';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { searchProfileAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';

const ContactsToFollow: FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    user: {
      search: { results, loading },
    },
  } = useSelector((state: AppState) => state);

  const [displayCount, setDisplayCount] = useState(SUGGESTION_AMOUNT_LESS);

  useEffect(() => {
    dispatch(
      searchProfileAction({
        name: 'test',
        userContacts: false,
      })
    );
  }, []);

  return (
    <Box gap="small">
      <Box direction="row" align="center" justify="between">
        <Text size="small" weight={500} color="dark">
          People to add
        </Text>
        {results.data.length > SUGGESTION_AMOUNT_LESS && (
          <Button
            onClick={() => {
              setDisplayCount((ps) =>
                ps === SUGGESTION_AMOUNT_LESS
                  ? SUGGESTION_AMOUNT_MORE
                  : SUGGESTION_AMOUNT_LESS
              );
            }}
          >
            <Text size="small" color="neutral-2" weight={500}>
              {displayCount === SUGGESTION_AMOUNT_LESS
                ? t('common.seeMore')
                : t('common.seeLess')}
            </Text>
          </Button>
        )}
      </Box>
      {loading && <Text size="small">Loading</Text>}
      {!loading &&
        (results.data.length === 0 ? (
          <Text size="small">{t('ChannelsToFollow.noChannelsFound')}</Text>
        ) : (
          results.data.slice(0, displayCount).map((user) => (
            <Box direction="row" justify="between" align="center" key={user.id}>
              <Box direction="row" align="center" gap="small">
                <InitialsAvatar id={user.id} value={user.fullName} />
                <Box>
                  <Text size="small" weight={500} color="dark">
                    {user.fullName}
                  </Text>
                  <Text size="xsmall" color="status-disabled">
                    {user.userName}
                  </Text>
                </Box>
              </Box>
              <Button
                primary
                onClick={() => {
                  // dispatch(joinChannelAction(id));
                }}
                label="Add"
                size="small"
              />
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ContactsToFollow;
