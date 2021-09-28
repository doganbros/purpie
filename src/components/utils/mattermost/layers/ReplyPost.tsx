import { Box, Button, Layer, ResponsiveContext, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import { Client4 } from 'mattermost-redux/client';
import { Post } from 'mattermost-redux/types/posts';
import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setToastAction } from '../../../../store/actions/util.action';
import PostItem from '../PostItem';

interface Props {
  post: Post;
  name: string;
  onDismiss: () => void;
}

const ReplyPost: FC<Props> = ({ onDismiss, post, name }) => {
  const size = useContext(ResponsiveContext);
  const dispatch = useDispatch();

  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false && e.currentTarget.value) {
      try {
        e.preventDefault();
        await Client4.createPost({
          root_id: post.root_id || post.id,
          channel_id: post.channel_id,
          message: e.currentTarget.value,
        } as any);
        dispatch(setToastAction('ok', 'Successfuly replied post'));
        onDismiss();
      } catch (err) {
        dispatch(setToastAction('error', err.toString()));
      }
    }
  };

  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '720px' : undefined}
        height={size !== 'small' ? '505px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large" weight="bold">
              Reply Post
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <PostItem
          id={post.id}
          message={post.message}
          editedDate={post.edit_at}
          date={post.create_at}
          name={name}
        />
        <TextArea
          placeholder="Reply Post"
          resize="vertical"
          size="medium"
          fill={false}
          onKeyDown={onKeyDown}
        />
      </Box>
    </Layer>
  );
};

export default ReplyPost;
