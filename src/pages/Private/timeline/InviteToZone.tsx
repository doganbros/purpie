import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InviteForm from './InviteForm';
import { UserZoneListItem } from '../../../store/types/zone.types';
import { createZoneInvitationAction } from '../../../store/actions/invitation.action';
import { User } from '../../../store/types/auth.types';
import { AppState } from '../../../store/reducers/root.reducer';

interface InviteToZoneProps {
  zone?: UserZoneListItem;
}

const InviteToZone: FC<InviteToZoneProps> = ({ zone }) => {
  const dispatch = useDispatch();

  const {
    invitation: { zoneInvitations },
  } = useSelector((state: AppState) => state);

  const createZoneInvitation = (user: User) => {
    if (zone) dispatch(createZoneInvitationAction(zone.zone.id, user));
  };

  return (
    <InviteForm
      zoneName={zone?.zone.name}
      zoneSubdomain={zone?.zone.subdomain}
      createInvitation={createZoneInvitation}
      invitedUsers={zoneInvitations.data.map((i) => i.user)}
    />
  );
};

export default InviteToZone;
