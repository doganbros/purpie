import { Box, Button, Layer, ResponsiveContext, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { FC, useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../../../store/types/auth.types';
import { ChatMessage } from '../../../store/types/chat.types';
import MessageItem from '../MessageItem';

interface Props {
  message: ChatMessage;
  onDismiss: () => void;
  name?: string;
  to: string;
  user: User;
  onSubmit: (message: Partial<ChatMessage>) => void;
}

const ReplyPost: FC<Props> = ({
  onDismiss,
  message,
  onSubmit,
  name,
  user,
  to,
}) => {
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <Layer
      onClickOutside={onDismiss}
      onFocus={() => textAreaRef.current?.focus()}
    >
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
              {t('ReplyPost.reply')}
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <MessageItem message={message} />
        <TextArea
          placeholder={t('ReplyPost.replyTo', {
            toName: name ? ` to ${name}` : '',
          })}
          resize="vertical"
          autoFocus
          size="medium"
          ref={textAreaRef}
          fill={false}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.shiftKey === false &&
              e.currentTarget.value
            ) {
              e.preventDefault();
              onSubmit({
                parent: {
                  ...message,
                },
                medium: message.medium,
                to,
                createdBy: user,
                message: e.currentTarget.value,
              });
              e.currentTarget.value = '';
              return null;
            }
            return null;
          }}
        />
      </Box>
    </Layer>
  );
};

export default ReplyPost;
