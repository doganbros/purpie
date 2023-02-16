import { Box, Button, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import UserSearchItem from '../../../components/utils/UserSearchItem';
import { SearchParams } from '../../../models/utils';
import { searchProfileAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { UserBasic } from '../../../store/types/auth.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import Notifications from '../timeline/Notifications';
import ZonesToJoin from '../timeline/ZonesToJoin';
import SearchInput from './SearchInput';
import { createContactInvitation } from '../../../store/actions/invitation.action';

const ProfileSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const {
    user: {
      search: { results },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);

  const getSearchResults = (skip?: number) => {
    dispatch(
      searchProfileAction({
        name: value,
        userContacts: false,
        skip,
      })
    );
  };

  useEffect(() => {
    getSearchResults();
  }, [value]);

  console.log(results);
  const renderResults = () => {
    if (results.data.length === 0) {
      return <Text>{t('common.nothingFound')}</Text>;
    }
    return (
      <InfiniteScroll
        step={6}
        items={results.data}
        onMore={() => {
          getSearchResults(results.data.length);
        }}
      >
        {(item: UserBasic) => (
          <Box
            margin={{ vertical: 'xsmall' }}
            onClick={() => history.push(`/user/${item.userName}`)}
            direction="row"
            align="center"
            justify="between"
          >
            <UserSearchItem user={item} />

            {user?.id !== item.id &&
              (item.contactUserId ? (
                <Button plain disabled label={t('ContactsToFollow.added')} />
              ) : (
                <Button
                  primary
                  label={t('ContactsToFollow.add')}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(createContactInvitation(item?.email));
                  }}
                />
              ))}
          </Box>
        )}
      </InfiniteScroll>
    );
  };

  return (
    <PrivatePageLayout
      title={t('common.search')}
      topComponent={<SearchInput />}
      rightComponent={
        <Box pad="medium" gap="medium">
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <Notifications />
        </Box>
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Text weight="bold">
          {t('common.searchResult', { title: t('common.profile') })}
        </Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default ProfileSearch;
