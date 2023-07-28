/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Anchor, Box, Button, Text } from 'grommet';
import React, { FC } from 'react';

import { AppState } from '../../../store/reducers/root.reducer';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const MembershipSettings: () => Menu | null = () => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);

  const { t } = useTranslation();

  if (!user) return null;

  const memberShipPlan = 'Pro';
  const memberShipPlanOrder = ['Free', 'Essential', 'Pro', 'Enterprise'];
  interface MembershipLinks {
    [key: string]: string;
  }

  const membershipLinks: MembershipLinks = {
    Free: 'https://buy.stripe.com/test_28obLSfz30ySbBu6op',
    Essential: 'https://buy.stripe.com/test_4gwcPW0E9gxQ8pi4gj',
    Pro: 'https://buy.stripe.com/test_28obLSfz30ySbBu6op',
    Enterprise: 'https://buy.stripe.com/test_28obLSfz30ySbBu6op',
  };

  const comparePlans = (planName: string) => {
    if (
      memberShipPlanOrder.indexOf(planName) >
      memberShipPlanOrder.indexOf(memberShipPlan)
    ) {
      return `${t('settings.upgradeMembership')} to ${planName}`;
    }
    if (
      memberShipPlanOrder.indexOf(planName) <
      memberShipPlanOrder.indexOf(memberShipPlan)
    ) {
      return `${t('settings.downgradeMembership')} to ${planName}`;
    }
    if (planName === memberShipPlanOrder[0]) {
      return t('settings.activeMembership');
    }
    return t('settings.activeMembership');
  };

  const MembershipPlanBox: FC<{ planName: string; size?: string }> = ({
    planName,
    size,
  }) => {
    return (
      <Box
        elevation="peach"
        border={{ size: '1px', color: 'status-disabled' }}
        round="small"
        justify="center"
        align="center"
        pad="small"
        width={size || undefined}
      >
        <Text size="medium" weight="bold">
          {planName}
        </Text>
        <Text>Unlimited Streams</Text>
        <Text>Unlimited Video Upload</Text>
        <Text>Unlimited Meetings</Text>
        <Text>Unlimited Participants</Text>
        <Text size="small">10$ / month</Text>
        <Box margin={{ top: 'small' }}>
          <Anchor
            href={planName === memberShipPlan ? '#' : membershipLinks[planName]}
            label={
              <Button
                primary
                label={<Text size="small">{comparePlans(planName)}</Text>}
              />
            }
          />
        </Box>
      </Box>
    );
  };

  return {
    id: 0,
    key: 'MembershipSettings',
    label: t('settings.membershipSettings'),
    url: 'MembershipSettings',
    items: [
      {
        key: 'activeMembership',
        title: t('settings.activeMembership'),
        component: (
          <Box
            justify="between"
            align="start"
            // border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <Text>Pro</Text>
            <Anchor
              href="https://billing.stripe.com/p/login/test_dR62bu6hkcGFgp2dQQ"
              label={<Text size="small">Manage Invoice & Payments</Text>}
            />
          </Box>
        ),
      },
      {
        key: 'membershipPlans',
        title: t('settings.membershipPlans'),
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <MembershipPlanBox planName="Free" />
            <MembershipPlanBox planName="Essential" />
            <MembershipPlanBox planName="Pro" />
            <MembershipPlanBox planName="Enterprise" />
          </Box>
        ),
      },
    ],
  };
};

export default MembershipSettings;
