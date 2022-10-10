import { Box, Button, Layer, ResponsiveContext, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import React, { FC, useContext, useRef } from 'react';
import { ChatMessage } from '../../../store/types/chat.types';
import { useTranslate } from '../../../hooks/useTranslate';

interface Props {
  message: ChatMessage;
  onDismiss: () => void;
  onSubmit: (message: ChatMessage) => void;
}

const EditMessage: FC<Props> = ({ onDismiss, message, onSubmit }) => {
  const size = useContext(ResponsiveContext);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const t = useTranslate('EditMessage');

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
              {t('edit')}
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <TextArea
          placeholder={t('edit')}
          ref={textAreaRef}
          defaultValue={message.message}
          resize="vertical"
          autoFocus
          size="medium"
          fill={false}
          onKeyDown={(e) => {
            if (
              e.key === 'Enter' &&
              e.shiftKey === false &&
              e.currentTarget.value
            ) {
              e.preventDefault();
              onSubmit({
                ...message,
                message: e.currentTarget.value,
                edited: true,
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

export default EditMessage;
