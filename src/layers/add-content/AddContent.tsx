import React, { FC, useContext } from 'react';
import { Box, Button, Layer, ResponsiveContext, Text } from 'grommet';
import {
  CirclePlay,
  Close,
  Group,
  Schedules,
  ShareOption,
} from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import AddContentButton from './AddContentButton';
import {
  createMeetingAction,
  openPlanCreateMeetingLayerAction,
} from '../../store/actions/meeting.action';
import { AppState } from '../../store/reducers/root.reducer';
import { openCreateVideoLayerAction } from '../../store/actions/post.action';

interface AddContentProps {
  onDismiss: () => void;
}

const AddContent: FC<AddContentProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);

  const {
    meeting: {
      createMeeting: {
        form: { submitting },
      },
    },
  } = useSelector((state: AppState) => state);

  const iconProps = {
    size: 'large',
    color: 'white',
  };
  const buttonProps = [
    {
      id: 0,
      icon: <Group {...iconProps} />,
      title: 'Meet!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {
        if (!submitting) dispatch(createMeetingAction({ public: true }));
        onDismiss();
      },
    },
    {
      id: 1,
      icon: <CirclePlay {...iconProps} />,
      title: 'Stream!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
    {
      id: 2,
      icon: <ShareOption {...iconProps} />,
      title: 'Share a Video',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {
        dispatch(openCreateVideoLayerAction());
        onDismiss();
      },
    },
    {
      id: 3,
      icon: <Schedules {...iconProps} />,
      title: 'Plan a Meeting',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {
        dispatch(openPlanCreateMeetingLayerAction);
        onDismiss();
      },
    },
    {
      id: 4,
      icon: <Group {...iconProps} />,
      title: 'Meet!',
      description:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
      onClick: () => {},
    },
  ];

  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '720px' : undefined}
        height={size !== 'small' ? '505px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
        gap="medium"
      >
        <Box direction="row" justify="between" align="start" pad="medium">
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
          justify={size === 'small' ? 'center' : 'start'}
          height="min-content"
          overflow="auto"
          wrap
          pad="medium"
        >
          {buttonProps.map(({ id, icon, title, description, onClick }) => (
            <Box key={id} margin={{ right: 'small', bottom: 'small' }}>
              <AddContentButton
                icon={icon}
                title={title}
                description={description}
                onClick={onClick}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Layer>
  );
};

export default AddContent;
