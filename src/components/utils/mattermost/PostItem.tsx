import dayjs from 'dayjs';
import { Anchor, Avatar, Box, Text } from 'grommet';
import { Post } from 'mattermost-redux/types/posts';
import React, { FC } from 'react';

interface Props {
  id: string;
  message: string;
  name: string;
  date: number | Date;
  editedDate: number | Date;
  rootPost?: Post;
  side?: 'right' | 'left';
  actions?: React.ReactNode | null;
}

const PostItem: FC<Props> = ({
  message,
  name,
  date,
  editedDate,
  side,
  children,
  id,
  rootPost,
  actions,
}) => {
  return (
    <Box
      direction="row"
      id={`post-item-${id}`}
      justify={side === 'right' ? 'end' : 'start'}
      alignContent="end"
      gap="small"
      margin="small"
    >
      <Avatar background="accent-2" margin={{ right: 'xsmall' }}>
        {name
          .split(' ')
          .map((v) => v.charAt(0)?.toUpperCase() || '')
          .join('')}
      </Avatar>
      <Box direction="column" width={{ min: '200px', width: '40%' }}>
        <Box direction="row" justify="between" align="center">
          <Box direction="row">
            <Text size="small" margin={{ right: 'xsmall' }} weight="bold">
              {name}
            </Text>
            <Text size="small">{dayjs(date).format('hh:mm:a')}</Text>
          </Box>
          {actions}
        </Box>
        <Box>
          {rootPost ? (
            <Text size="xsmall" margin={{ bottom: 'xsmall' }}>
              <Text size="xsmall" as="i" margin={{ right: 'xsmall' }}>
                Replied to:
              </Text>
              <Anchor href={`#post-item-${rootPost.id}`}>
                {rootPost.message}
              </Anchor>
            </Text>
          ) : null}
          <Text size="small">{message}</Text>
          {editedDate ? <Text size="xsmall">(edited)</Text> : null}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default PostItem;
