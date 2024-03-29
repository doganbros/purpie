import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  Form,
  FormField,
  Grid,
  InfiniteScroll,
  Text,
  ThemeContext,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/post/PostGridItem';
import { useResponsive } from '../../../hooks/useResponsive';

import { AppState } from '../../../store/reducers/root.reducer';
import { Post, PostSearchOptions } from '../../../store/types/post.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import Notifications from '../timeline/Notifications';
import ZonesToJoin from '../timeline/ZonesToJoin';
import FilterWrapper from './FilterWrapper';
import SearchInput from './SearchInput';
import { searchPostAction } from '../../../store/actions/post.action';
import { SearchParams } from '../../../models/utils';
import Switch from '../../../components/utils/Switch';
import { theme } from '../../../config/app-config';

const PostSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const size = useResponsive();
  const { t } = useTranslation();

  const [options, setOptions] = useState<PostSearchOptions>({
    following: false,
    streaming: false,
  });

  const {
    post: {
      search: { results },
    },
  } = useSelector((state: AppState) => state);

  const getSearchResults = (skip?: number) => {
    const { following, streaming } = options;
    dispatch(
      searchPostAction({
        searchTerm: value,
        following,
        streaming,
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
      <Grid columns={size !== 'small' ? 'medium' : '100%'}>
        <InfiniteScroll
          step={6}
          items={results.data}
          onMore={() => {
            getSearchResults(results.data.length);
          }}
        >
          {(item: Post) => (
            <PostGridItem
              post={item}
              onClickPlay={() => history.push(`/video/${item.id}`)}
            />
          )}
        </InfiniteScroll>
      </Grid>
    );
  };

  return (
    <PrivatePageLayout
      title={t('common.search')}
      topComponent={<SearchInput />}
      rightComponent={
        <Box pad="medium" gap="medium">
          <ThemeContext.Extend
            value={{
              ...theme,
              formField: {
                ...theme?.formField,
                border: {
                  side: 'all',
                  color: 'transparent',
                },
              },
            }}
          >
            <FilterWrapper>
              <Form value={options} onChange={setOptions}>
                <FormField name="following">
                  <Switch
                    label={t('common.following')}
                    name="following"
                    textProps={{ color: 'dark' }}
                    pad={{ vertical: '3px' }}
                  />
                </FormField>
                <FormField name="streaming">
                  <Switch
                    label={t('common.streaming')}
                    name="streaming"
                    textProps={{ color: 'dark' }}
                    pad={{ vertical: '3px' }}
                  />
                </FormField>
              </Form>
            </FilterWrapper>
          </ThemeContext.Extend>
          <Divider />
          <ChannelsToFollow />
          <Divider />
          <ZonesToJoin />
          <Notifications />
        </Box>
      }
    >
      <Box pad={{ vertical: 'medium' }} gap="medium">
        <Text weight="bold">
          {t('common.searchResult', { title: t('common.post') })}
        </Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default PostSearch;
