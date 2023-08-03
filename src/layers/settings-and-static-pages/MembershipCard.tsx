import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { Membership } from '../../store/types/membership.types';
import { createPaymentSession } from '../../store/services/membership.service';

interface MembershipCardProps {
  membership: Membership;
  index: number;
  userMembershipIndex: number;
}

const MembershipCard: FC<MembershipCardProps> = ({
  membership,
  index,
  userMembershipIndex,
}) => {
  const { t } = useTranslation();

  const getActionLabel = () => {
    if (index < userMembershipIndex)
      return `${t('settings.downgradeMembership')} to ${membership.type}`;
    if (index > userMembershipIndex)
      return `${t('settings.upgradeMembership')} to ${membership.type}`;
    return t('settings.activeMembership');
  };

  const createPayment = async () => {
    window.location.href = await createPaymentSession(membership.id);
  };

  return (
    <Box
      elevation="peach"
      border={{ size: '1px', color: 'status-disabled' }}
      round="small"
      justify="center"
      align="center"
      pad="small"
    >
      <Text size="medium" weight="bold">
        {membership.type}
      </Text>
      <Text>Unlimited Streams</Text>
      <Text>Unlimited Video Upload</Text>
      <Text>Unlimited Meetings</Text>
      <Text>Unlimited Participants</Text>
      <Text size="small">{`${membership.price}$ / month`}</Text>
      <Box margin={{ top: 'small' }}>
        <Button
          onClick={createPayment}
          disabled={userMembershipIndex === index}
          size="small"
          primary
          label={<Text size="xsmall">{getActionLabel()}</Text>}
        />
      </Box>
    </Box>
  );
};

export default MembershipCard;
