import React, { FC, useContext } from 'react';
import { Box, Button, Layer, ResponsiveContext, Text } from 'grommet';
import {
  CirclePlay,
  Close,
  Group,
  SchedulePlay,
  ServicePlay,
  ShareOption,
  Workshop,
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
      title: t('AddContent.meeting'),
      description: t('AddContent.meetingDescription'),
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
      icon: <SchedulePlay {...iconProps} />,
      title: t('AddContent.customMeeting'),
      description: t('AddContent.customMeetingDescription'),
      onClick: () => {
        dispatch(openPlanCreateMeetingLayerAction);
        onDismiss();
      },
    },
    {
      id: 4,
      icon: <ServicePlay {...iconProps} />,
      title: t('AddContent.streamingStudio'),
      description: t('AddContent.streamingStudioDescription'),
      onClick: () => {},
    },
    {
      id: 5,
      icon: <Workshop {...iconProps} />,
      title: t('AddContent.webinar'),
      description: t('AddContent.webinarDescription'),
      onClick: () => {},
    },
  ];

  return (
    <Layer onClickOutside={onDismiss}>
      <Box
        width={size !== 'small' ? '700px' : undefined}
        round={size !== 'small' ? '20px' : undefined}
        fill={size === 'small'}
        background="white"
      >
        <Box
          direction="row"
          justify="between"
          align="start"
          pad={{ top: 'medium', horizontal: 'medium' }}
        >
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
            <Box
              key={id}
              margin={{
                right: id === 2 || id === 5 ? '0' : 'medium',
                bottom: id > 2 ? '0' : 'medium',
              }}
            >
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
