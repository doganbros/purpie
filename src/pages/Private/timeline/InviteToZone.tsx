import React, { FC } from 'react';
import InviteForm from './InviteForm';
import { UserZoneListItem } from '../../../store/types/zone.types';

interface InviteToZoneProps {
  zone?: UserZoneListItem;
}

const InviteToZone: FC<InviteToZoneProps> = ({ zone }) => {
  const createZoneInvitation = () => {
    console.log('createChannelInvitation');
  };

  return (
    <InviteForm
      zoneName={zone?.zone.name}
      zoneSubdomain={zone?.zone.subdomain}
      createInvitation={createZoneInvitation}
    />
  );
};

export default InviteToZone;
