import React, { FC } from 'react';
import { Avatar, TextExtendedProps } from 'grommet';
import { useSelector } from 'react-redux';
import InitialsAvatar from './InitialsAvatar';
import { apiURL } from '../../../config/http';
import { AppState } from '../../../store/reducers/root.reducer';

interface ChannelAvatarProps {
  name?: string;
  src?: string;
  id: number;
  textProps?: TextExtendedProps;
}

export const ChannelAvatar: FC<ChannelAvatarProps> = ({
  name,
  src,
  id,
  ...textProps
}) => {
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  const channelAvatarUrl = userChannels.data.filter(
    (userChannel) => userChannel.channel.name === name
  )[0]?.channel?.displayPhoto;
  const AvatarComponent = () => {
    if (src === null || src === undefined) {
      return <InitialsAvatar id={id} value={name} textProps={textProps} />;
    }
    if (src) {
      return (
        <Avatar
          alignSelf="center"
          round="full"
          src={`${apiURL}/channel/display-photo/${src}`}
        />
      );
    }
    return (
      <Avatar
        alignSelf="center"
        round="full"
        src={`${apiURL}/channel/display-photo/${channelAvatarUrl}`}
      />
    );
  };
  return <AvatarComponent />;
};
