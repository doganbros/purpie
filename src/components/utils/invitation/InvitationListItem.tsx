import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { InvitationResponseType, InvitationType } from '../../../models/utils';
import { responseInvitationActions } from '../../../store/actions/invitation.action';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/invitation.types';
import { AppState } from '../../../store/reducers/root.reducer';
import { UserAvatar } from '../Avatars/UserAvatar';

interface InvitationListItemProps {
  invitation: InvitationListItemType;
}

const InvitationListItem: FC<InvitationListItemProps> = ({ invitation }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    invitation: { responseInvitation },
  } = useSelector((state: AppState) => state);

  const getInvitationPayload = () => {
    let invitationType;
    let invitationMessage;
    if (invitation.zone) {
      invitationType = InvitationType.ZONE;
      invitationMessage = t('Invitations.zoneInvitationMessage', {
        fullName: invitation.createdBy.fullName,
        zone: invitation.zone.name,
      });
    } else if (invitation.channel) {
      invitationType = InvitationType.CHANNEL;
      invitationMessage = t('Invitations.channelInvitationMessage', {
        fullName: invitation.createdBy.fullName,
        channel: invitation.channel.name,
      });
    } else {
      invitationType = InvitationType.CONTACT;
      invitationMessage = t('Invitations.contactInvitationMessage', {
        fullName: invitation.createdBy.fullName,
      });
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
      <Text size="xsmall" weight="bold" color="neutral-2">
        {message}
      </Text>
      <Box direction="row" justify="between" align="center">
        <Box direction="row" align="center" gap="small">
          <UserAvatar
            id={invitation.createdBy.id}
            name={invitation.createdBy.fullName}
            src={invitation.createdBy.displayPhoto}
          />
          <Box>
            <Text size="small" weight={500} color="dark">
              {invitation.createdBy.fullName}
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
                  ? t('common.joined')
                  : t('common.ignored')}
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
                  {t('common.join')}
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
                  {t('common.ignore')}
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
