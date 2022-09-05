import React, { FC, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Text } from 'grommet';
import InitialsAvatar from '../InitialsAvatar';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/activity.types';
import { InvitationResponseType, InvitationType } from '../../../models/utils';
import { responseInvitationActions } from '../../../store/actions/activity.action';
import { AppState } from '../../../store/reducers/root.reducer';

interface InvitationListItemProps {
  invitation: InvitationListItemType;
}

const InvitationListItem: FC<InvitationListItemProps> = ({ invitation }) => {
  const dispatch = useDispatch();

  const {
    activity: { responseInvitation },
  } = useSelector((state: AppState) => state);

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

  const invitationResponse =
    responseInvitation.response &&
    responseInvitation.response.id === invitation.id
      ? responseInvitation
      : null;
  return (
    <Box gap="xsmall" key={invitation.id}>
      <Text size="xsmall" weight={500} color="neutral-2">
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
        {invitationResponse ? (
          <Button reverse>
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'medium' }}
              direction="row"
              align="center"
            >
              <Text size="xsmall" weight={500}>
                {invitationResponse.response?.response ===
                InvitationResponseType.ACCEPT
                  ? 'Joined'
                  : 'Ignored'}
              </Text>
            </Box>
          </Button>
        ) : (
          <Box direction="row" gap="xsmall">
            <Button
              primary
              disabled={responseInvitation.loading}
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
              disabled={responseInvitation.loading}
              plain
              onClick={() =>
                submitInvitationResponse(InvitationResponseType.REJECT)
              }
            >
              <Box pad={{ vertical: 'xsmall' }} direction="row" align="center">
                <Text size="xsmall" color="brand" weight={500}>
                  Ignore
                </Text>
              </Box>
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InvitationListItem;
