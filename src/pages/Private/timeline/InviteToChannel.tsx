import React, { FC } from 'react';
import InviteForm from './InviteForm';
import { UserChannelListItem } from '../../../store/types/channel.types';

interface InviteToChannelProps {
  channel: UserChannelListItem;
}

const InviteToChannel: FC<InviteToChannelProps> = ({ channel }) => {
  const createChannelInvitation = () => {
    console.log('createChannelInvitation');
  };

  return (
    <InviteForm
      channelName={channel.channel.name}
      createInvitation={createChannelInvitation}
    />
  );
};

export default InviteToChannel;
