import { Box, Form, FormField, InfiniteScroll, Text } from 'grommet';
import React, { FC, useEffect, useState } from 'react';
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
import { ProfileSearchOptions } from '../../../store/types/user.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import FilterWrapper from './FilterWrapper';
import SearchInput from './SearchInput';
import Switch from '../../../components/utils/Switch';

const ProfileSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [options, setOptions] = useState<ProfileSearchOptions>({
    userContacts: false,
  });

  const {
    user: {
      search: { results },
    },
  } = useSelector((state: AppState) => state);

  const getSearchResults = (skip?: number) => {
    const { userContacts } = options;
    dispatch(
      searchProfileAction({
        name: value,
        userContacts,
        skip,
      })
    );
  };

  useEffect(() => {
    getSearchResults();
  }, [value, options]);

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
          >
            <UserSearchItem user={item} />
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
          <FilterWrapper>
            <Form value={options} onChange={setOptions}>
              <FormField name="userContacts">
                <Switch
                  label={t('ProfileSearch.contactsOnly')}
                  name="userContacts"
                />
              </FormField>
            </Form>
          </FilterWrapper>
          <Divider />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <LastActivities />
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
