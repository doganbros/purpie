import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { Membership } from '../../store/types/membership.types';
import { createPaymentSession } from '../../store/services/membership.service';
import { useResponsive } from '../../hooks/useResponsive';

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
  const size = useResponsive();

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

  const getValueText = (value: any) => {
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    return value;
  };

  return (
    <Box
      gap="small"
      width="full"
      elevation="peach"
      border={{ size: '1px', color: 'status-disabled' }}
      round="small"
      justify="center"
      align="center"
      pad={size === 'small' ? 'medium' : 'small'}
    >
      <Text size="medium" weight="bold">
        {membership.type}
      </Text>
      <Box width="full">
        {Object.entries(membership.actions).map(([key, value]) => (
          <Box direction="row" align="center" justify="between" key={key}>
            <Text size="xsmall" weight="normal" color="status-disabled">
              {t(`Membership.${key}`)}
            </Text>
            <Text size="small" color="dark" weight={500}>
              {getValueText(value)}
            </Text>
          </Box>
        ))}
      </Box>

      <Text
        size="medium"
        weight={500}
        color="dark"
      >{`${membership.price}$ / month`}</Text>
      <Box>
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
