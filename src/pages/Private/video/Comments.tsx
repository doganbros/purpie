import React, { FC, useEffect } from 'react';
import dayjs from 'dayjs';
import LocalizedFormat from 'dayjs/plugin/localizedFormat';
import {
  Box,
  Button,
  DropButton,
  InfiniteScroll,
  Stack,
  Text,
  TextArea,
} from 'grommet';
import { MoreVertical } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { listPostCommentsAction } from '../../../store/actions/post.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ListButton from '../../../components/utils/ListButton';

dayjs.extend(LocalizedFormat);

interface CommentsProps {
  postId: number;
}

const Comments: FC<CommentsProps> = ({ postId }) => {
  const {
    auth: { user },
    post: {
      postDetail: { comments },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const getComments = (skip?: number) => {
    dispatch(listPostCommentsAction({ postId, skip }));
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        Comments
      </Text>
      <Box direction="row" align="center" gap="small">
        {user && (
          <Box flex={{ shrink: 0 }}>
            <InitialsAvatar
              id={user.id}
              value={`${user?.firstName} ${user?.lastName}`}
            />
          </Box>
        )}
        <Box
          elevation="peach"
          fill
          round="small"
          direction="row"
          align="center"
          gap="small"
          pad={{ right: 'small' }}
        >
          <TextArea
            resize={false}
            plain
            focusIndicator={false}
            placeholder="Write a comment"
          />
          <Button label="Send" size="small" primary />
        </Box>
      </Box>
      <InfiniteScroll items={comments.data}>
        {(item: typeof comments.data[0]) => (
          <Stack key={item.id} interactiveChild="first">
            <Stack anchor="top-right" interactiveChild="last">
              <Box
                pad={{ vertical: 'small', right: 'small', left: 'medium' }}
                margin={{ vertical: 'small', left: 'medium' }}
                elevation="peach"
                round="small"
              >
                <Box pad={{ left: 'small' }}>
                  <Text weight="bold">{`${item.user.firstName} ${item.user.lastName}`}</Text>
                  <Text color="status-disabled">{item.comment}</Text>
                </Box>
              </Box>
              <Box pad={{ right: 'small', top: 'small' }} direction="row">
                <Text size="small" color="status-disabled">
                  {dayjs(item.createdOn).format('L')}
                </Text>
                {item.user.id === user?.id && (
                  <DropButton
                    plain
                    icon={<MoreVertical color="status-disabled-light" />}
                    dropContent={
                      <>
                        <ListButton>
                          <Text>Edit Comment</Text>
                        </ListButton>
                        <ListButton>
                          <Text>Delete</Text>
                        </ListButton>
                      </>
                    }
                    dropAlign={{ top: 'bottom', right: 'right' }}
                  />
                )}
              </Box>
            </Stack>
            <InitialsAvatar
              id={item.user.id}
              value={`${item.user.firstName} ${item.user.lastName}`}
            />
          </Stack>
        )}
      </InfiniteScroll>
    </Box>
  );
};

export default Comments;
