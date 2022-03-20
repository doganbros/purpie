import { Box, Button, Layer, ResponsiveContext, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { FC, useContext } from 'react';
import { ChatMessage } from '../../../store/types/chat.types';
import MessageItem from '../MessageItem';

interface Props {
  message: ChatMessage;
  onDismiss: () => void;
}

const ReplyPost: FC<Props> = ({ onDismiss, message }) => {
  const size = useContext(ResponsiveContext);

  // const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  //   if (e.key === 'Enter' && e.shiftKey === false && e.currentTarget.value) {
  //     try {
  //       e.preventDefault();
  //       await Client4.createPost({
  //         root_id: message.root_id || message.id,
  //         channel_id: message.channel_id,
  //         message: e.currentTarget.value,
  //       } as any);
  //       dispatch(setToastAction('ok', 'Successfuly replied message'));
  //       onDismiss();
  //     } catch (err: any) {
  //       dispatch(setToastAction('error', err.toString()));
  //     }
  //   }
  // };

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
        <MessageItem message={message} />
        <TextArea
          placeholder="Reply Post"
          resize="vertical"
          size="medium"
          fill={false}
          // onKeyDown={onKeyDown}
        />
      </Box>
    </Layer>
  );
};

export default ReplyPost;
