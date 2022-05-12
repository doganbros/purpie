import { Box } from 'grommet';
import React from 'react';

interface Props {
  medium: 'direct' | 'channel' | 'post';
  name?: string;
  id: number;
  canReply?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  handleTypingEvent?: boolean;
}
const FETCH_MESSAGE_LIMIT = 50;

const Chat: React.FC<Props> = ({
  id,
  medium,
  handleTypingEvent,
  name,
  canDelete = true,
  canReply = true,
  canEdit = true,
}) => {
  console.log({
    id,
    medium,
    handleTypingEvent,
    name,
    canDelete,
    canReply,
    canEdit,
    FETCH_MESSAGE_LIMIT,
  });
  return (
    <Box fill>
      <Box flex={false} tag="header" background="brand" pad="small">
        Header
      </Box>
      <Box flex overflow="auto">
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
        <p>body</p>
      </Box>
      <Box flex={false} background="dark-1" pad="small">
        footer
      </Box>
    </Box>
  );
};

export default Chat;
