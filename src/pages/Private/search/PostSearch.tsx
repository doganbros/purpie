import React, { FC, useEffect, useState } from 'react';
import {
  Box,
  CheckBox,
  Form,
  FormField,
  Grid,
  InfiniteScroll,
  Spinner,
  Text,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import Divider from '../../../components/utils/Divider';
import PostGridItem from '../../../components/utils/PostGridItem/PostGridItem';
import { useResponsive } from '../../../hooks/useResponsive';
import {
  saveSearchedPostAction,
  searchPostAction,
} from '../../../store/actions/search.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { Post } from '../../../store/types/post.types';
import {
  PostSearchOptions,
  SearchScope,
} from '../../../store/types/search.types';
import ChannelsToFollow from '../timeline/ChannelsToFollow';
import LastActivities from '../timeline/LastActivities';
import ZonesToJoin from '../timeline/ZonesToJoin';
import FilterWrapper from './FilterWrapper';
import SearchInput from './SearchInput';

interface SearchParams {
  value: string;
  scope: SearchScope;
}

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
    search: { loading, searchResults },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    const { following, streaming } = options;
    dispatch(searchPostAction({ searchTerm: value, following, streaming }));
  }, [value, options]);

  const renderResults = () => {
    if (loading) {
      return <Spinner />;
    }
    if (!searchResults || searchResults.scope !== SearchScope.post) {
      return null;
    }
    if (searchResults.data.length === 0) {
      return <Text>Nothing Found</Text>;
    }
    return (
      <Grid columns={size !== 'small' ? 'medium' : '100%'}>
        <InfiniteScroll step={6} items={searchResults.data} onMore={() => {}}>
          {(item: Post) => (
            <PostGridItem
              post={item}
              onClickPlay={() => history.push(`video/${item.id}`)}
              onClickSave={() => {
                if (!item.saved) dispatch(saveSearchedPostAction(item.id));
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
