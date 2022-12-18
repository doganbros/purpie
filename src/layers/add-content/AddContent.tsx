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
import { useTranslation } from 'react-i18next';
import AddContentButton from './AddContentButton';
import {
  createMeetingAction,
  openPlanCreateMeetingLayerAction,
} from '../../store/actions/meeting.action';
import { AppState } from '../../store/reducers/root.reducer';
import { openCreateVideoLayerAction } from '../../store/actions/post.action';
import { CreateMeetingPayload } from '../../store/types/meeting.types';

interface AddContentProps {
  onDismiss: () => void;
}

const AddContent: FC<AddContentProps> = ({ onDismiss }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);

  const {
    meeting: {
      createMeeting: {
        form: { submitting },
      },
    },
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const iconProps = {
    size: 'large',
    color: 'white',
  };
  const buttonProps = [
    {
      id: 0,
      icon: <Group {...iconProps} />,
      title: t('AddContent.meet'),
      description: t('AddContent.meetDescription'),
      onClick: () => {
        const meeting: CreateMeetingPayload = { public: true };
        if (selectedChannel) meeting.channelId = selectedChannel.channel.id;
        if (!submitting) dispatch(createMeetingAction(meeting));
        onDismiss();
      },
    },
    {
      id: 1,
      icon: <CirclePlay {...iconProps} />,
      title: t('AddContent.stream'),
      description: t('AddContent.streamDescription'),
      onClick: () => {},
    },
    {
      id: 2,
      icon: <ShareOption {...iconProps} />,
      title: t('AddContent.shareVideo'),
      description: t('AddContent.shareVideoDescription'),
      onClick: () => {
        dispatch(openCreateVideoLayerAction());
        onDismiss();
      },
    },
    {
      id: 3,
      icon: <Schedules {...iconProps} />,
      title: t('AddContent.planMeeting'),
      description: t('AddContent.planMeetingDescription'),
      onClick: () => {
        dispatch(openPlanCreateMeetingLayerAction);
        onDismiss();
      },
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
              {t('AddContent.title')}
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
