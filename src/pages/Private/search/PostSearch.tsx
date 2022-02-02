import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  CheckBox,
  Form,
  FormField,
  Grid,
  InfiniteScroll,
  Text,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import { useResponsive } from '../../../hooks/useResponsive';

import { AppState } from '../../../store/reducers/root.reducer';
import { Post, PostSearchOptions } from '../../../store/types/post.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import FilterWrapper from './FilterWrapper';
import SearchInput from './SearchInput';
import {
  createPostSaveAction,
  searchPostAction,
} from '../../../store/actions/post.action';
import { SearchParams } from './types';

const PostSearch: FC = () => {
  const { value } = useParams<SearchParams>();
  const dispatch = useDispatch();
  const history = useHistory();
  const size = useResponsive();

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
      return <Text>Nothing Found</Text>;
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
              onClickPlay={() => history.push(`video/${item.id}`)}
              onClickSave={() => {
                if (!item.saved)
                  dispatch(createPostSaveAction({ postId: item.id }));
              }}
            />
          )}
        </InfiniteScroll>
      </Grid>
    );
  };

  return (
    <PrivatePageLayout
      title="Search"
      topComponent={<SearchInput />}
      rightComponent={
        <Box pad="medium" gap="medium">
          <FilterWrapper>
            <Form value={options} onChange={setOptions}>
              <FormField name="following">
                <CheckBox toggle name="following" label="Following" />
              </FormField>
              <FormField name="streaming">
                <CheckBox toggle name="streaming" label="Streaming" />
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
        <Text weight="bold">Post Results</Text>
        {renderResults()}
      </Box>
    </PrivatePageLayout>
  );
};

export default PostSearch;
