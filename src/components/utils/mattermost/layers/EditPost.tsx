import { Box, Button, Layer, ResponsiveContext, Text, TextArea } from 'grommet';
import { Close } from 'grommet-icons';
import { Client4 } from 'mattermost-redux/client';
import React, { FC, useContext } from 'react';
import { useDispatch } from 'react-redux';
import { setToastAction } from '../../../../store/actions/util.action';

interface Props {
  id: string;
  message: string;
  onDismiss: () => void;
}

const EditPost: FC<Props> = ({ onDismiss, id, message }) => {
  const size = useContext(ResponsiveContext);
  const dispatch = useDispatch();

  const onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.shiftKey === false && e.currentTarget.value) {
      e.preventDefault();
      await Client4.updatePost({
        id,
        message: e.currentTarget.value,
      } as any);
      dispatch(setToastAction('ok', 'Successfuly edited post'));
      onDismiss();
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
              Edit Post
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <TextArea
          placeholder="Edit Post"
          defaultValue={message}
          resize="vertical"
          size="medium"
          fill={false}
          onKeyDown={onKeyDown}
        />
      </Box>
    </Layer>
  );
};

export default EditPost;
