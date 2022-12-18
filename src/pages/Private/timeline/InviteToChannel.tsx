import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InviteForm from './InviteForm';
import { UserChannelListItem } from '../../../store/types/channel.types';
import { createChannelInvitationAction } from '../../../store/actions/invitation.action';
import { User } from '../../../store/types/auth.types';
import { AppState } from '../../../store/reducers/root.reducer';

interface InviteToChannelProps {
  channel: UserChannelListItem;
}

const InviteToChannel: FC<InviteToChannelProps> = ({ channel }) => {
  const dispatch = useDispatch();

  const {
    invitation: { channelInvitations },
  } = useSelector((state: AppState) => state);

  const createChannelInvitation = (user: User) => {
    dispatch(createChannelInvitationAction(channel.channel.id, user));
  };

  return (
    <InviteForm
      channelName={channel.channel.name}
      createInvitation={createChannelInvitation}
      invitedUsers={channelInvitations.data.map((d) => d.user)}
    />
  );
};

export default InviteToChannel;
