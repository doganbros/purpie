import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Button, Text } from 'grommet';
import InitialsAvatar from '../InitialsAvatar';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/activity.types';
import { InvitationResponseType, InvitationType } from '../../../models/utils';
import { responseInvitationActions } from '../../../store/actions/activity.action';

interface InvitationListItemProps {
  invitation: InvitationListItemType;
}

const InvitationListItem: FC<InvitationListItemProps> = ({ invitation }) => {
  const dispatch = useDispatch();

  const [invitationType, setInvitationType] = useState<InvitationType>(
    InvitationType.CONTACT
  );
  const [invitationMessage, setInvitationMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (invitation.zone) {
      setInvitationType(InvitationType.ZONE);
      setInvitationMessage(
        `${invitation.createdBy.firstName} invited you to ${invitation.zone.zone_name} zone.`
      );
    } else if (invitation.channel) {
      setInvitationType(InvitationType.CHANNEL);
      setInvitationMessage(
        `${invitation.createdBy.firstName} invited you to ${invitation.channel.channel_name} channel.`
      );
    } else {
      setInvitationType(InvitationType.CONTACT);
      setInvitationMessage(
        `${invitation.createdBy.firstName} invited you to as a contact.`
      );
    }
  }, [invitation]);

  const submitInvitationResponse = (response: InvitationResponseType) => {
    dispatch(
      responseInvitationActions({
        id: invitation.id,
        response,
        type: invitationType,
      })
    );
  };

  return (
    <Box gap="xsmall">
      <Text size="xsmall" weight={500} color="#3D138D">
        {invitationMessage}
      </Text>
      <Box direction="row" justify="between" align="center">
        <Box direction="row" align="center" gap="small">
          <InitialsAvatar
            id={invitation.createdBy.id}
            value={`${invitation.createdBy.firstName} ${invitation.createdBy.lastName}`}
          />
          <Box>
            <Text size="small" weight={500} color="#202631">
              {`${invitation.createdBy.firstName} ${invitation.createdBy.lastName}`}
            </Text>
            <Text size="10px" color="status-disabled">
              {`@${invitation.createdBy.userName}`}
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="xsmall">
          <Button
            primary
            onClick={() =>
              submitInvitationResponse(InvitationResponseType.ACCEPT)
            }
          >
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'medium' }}
              direction="row"
              align="center"
            >
              <Text size="xsmall" weight={500}>
                Join
              </Text>
            </Box>
          </Button>
          <Button
            plain
            onClick={() =>
              submitInvitationResponse(InvitationResponseType.REJECT)
            }
          >
            <Box pad={{ vertical: 'xsmall' }} direction="row" align="center">
              <Text size="xsmall" color="#9060EB" weight={500}>
                Ignore
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvitationListItem;
