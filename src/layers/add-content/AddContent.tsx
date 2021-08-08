import React, { FC } from 'react';
import { Box, Button, Layer, Text } from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch } from 'react-redux';
import AddContentButton from '../../components/utils/AddContentButton';
import { openCreateMeetingLayerAction } from '../../store/actions/meeting.action';
import buttonProps from './buttonProps';

interface AddContentProps {
  onDismiss: () => void;
}

const AddContent: FC<AddContentProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const openMeetingLayer = () => dispatch(openCreateMeetingLayerAction);
  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width="720px"
        height="505px"
        round="20px"
        background="white"
        pad="medium"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start">
          <Box pad="xsmall">
            <Text size="large" weight="bold">
              Take Your Pick
            </Text>
          </Box>
          <Button plain onClick={onDismiss}>
            <Close color="brand" />
          </Button>
        </Box>
        <Box
          direction="row"
          justify="start"
          height="min-content"
          overflow="auto"
          wrap
        >
          {buttonProps(onDismiss, openMeetingLayer).map((b) => (
            <Box key={b.title} margin={{ right: 'xxsmall' }}>
              <AddContentButton {...b} />
            </Box>
          ))}
        </Box>
      </Box>
    </Layer>
  );
};

export default AddContent;
