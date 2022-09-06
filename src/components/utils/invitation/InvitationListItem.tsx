import React, { FC, useMemo } from 'react';
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

  const getInvitationPayload = () => {
    let invitationType;
    let invitationMessage;
    if (invitation.zone) {
      invitationType = InvitationType.ZONE;
      invitationMessage = `${invitation.createdBy.firstName} invited you to ${invitation.zone.name} zone.`;
    } else if (invitation.channel) {
      invitationType = InvitationType.CHANNEL;
      invitationMessage = `${invitation.createdBy.firstName} invited you to ${invitation.channel.name} channel.`;
    } else {
      invitationType = InvitationType.CONTACT;
      invitationMessage = `${invitation.createdBy.firstName} wants to invite you to as a contact.`;
    }
    return { type: invitationType, message: invitationMessage };
  };

  const { type, message } = useMemo(() => getInvitationPayload(), [invitation]);

  const submitInvitationResponse = (response: InvitationResponseType) => {
    dispatch(
      responseInvitationActions({
        id: invitation.id,
        response,
        type,
      })
    );
  };

  return (
    <Box gap="xsmall" margin={{ top: 'small' }} key={invitation.id}>
      <Text size="xsmall" weight={500} color="neutral-2">
        {message}
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
              @{invitation.createdBy.userName}
            </Text>
          </Box>
        </Box>
        {invitation.response ? (
          <Button reverse>
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'medium' }}
              direction="row"
              align="center"
            >
              <Text size="xsmall" weight={500}>
                {invitation.response === InvitationResponseType.ACCEPT
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
