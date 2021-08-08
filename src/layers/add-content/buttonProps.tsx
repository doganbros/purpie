import React from 'react';
import { CirclePlay, Group, Schedules, ShareOption } from 'grommet-icons';

const iconProps = {
  size: 'large',
  color: 'white',
};

type ButtonProps = (
  onDismiss: () => void,
  openMeetingLayer: () => void
) => {
  iconName: JSX.Element;
  title: string;
  description: string;
  onClick: () => void;
}[];

const buttonProps: ButtonProps = (onDismiss, openMeetingLayer) => [
  {
    iconName: <Group {...iconProps} />,
    title: 'Meet!',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt.',
    onClick: () => {
      openMeetingLayer();
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

export default buttonProps;
