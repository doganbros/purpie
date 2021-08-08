import React, { FC } from 'react';
import { Box, Button, Layer, Text } from 'grommet';
import {
  CirclePlay,
  Close,
  Group,
  Schedules,
  ShareOption,
} from 'grommet-icons';
import { useDispatch } from 'react-redux';
import AddContentButton from './AddContentButton';
import { openCreateMeetingLayerAction } from '../../store/actions/meeting.action';

interface AddContentProps {
  onDismiss: () => void;
}

const AddContent: FC<AddContentProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const iconProps = {
    size: 'large',
    color: 'white',
  };
  const buttonProps = [
    {
      iconName: <Group {...iconProps} />,
      title: 'Meet!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {
        dispatch(openCreateMeetingLayerAction);
        onDismiss();
      },
    },
    {
      iconName: <CirclePlay {...iconProps} />,
      title: 'Stream!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
    {
      iconName: <ShareOption {...iconProps} />,
      title: 'Share a Video',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
    {
      iconName: <Schedules {...iconProps} />,
      title: 'Plan a Meeting',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
    {
      iconName: <Group {...iconProps} />,
      title: 'Meet! ',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
  ];

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
          {buttonProps.map((b) => (
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
