import { useTranslation } from 'react-i18next';
import { Anchor, Box, Text } from 'grommet';
import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listMembershipAction } from '../../../store/actions/membership.action';
import { AppState } from '../../../store/reducers/root.reducer';
import MembershipCard from '../../../layers/settings-and-static-pages/MembershipCard';
import { getCustomerPortal } from '../../../store/services/membership.service';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const MembershipSettings = (): Menu => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const { memberships, userMembership } = useSelector(
    (state: AppState) => state.membership
  );

  useEffect(() => {
    dispatch(listMembershipAction());
  }, []);

  const manageInvoiceAndPayments = async () => {
    const customerPortal = await getCustomerPortal();
    if (customerPortal) window.location.href = customerPortal;
  };

  const membershipInfo = useMemo(() => {
    const membershipList = memberships.data.sort(
      (m1, m2) => m1.price - m2.price
    );

    const userMembershipIndex = membershipList.findIndex(
      (m) => m.id === userMembership?.id
    );

    return { membershipList, userMembershipIndex };
  }, [memberships, userMembership]);

  return {
    key: 'MembershipSettings',
    label: t('settings.membershipSettings'),
    url: 'memberships',
    items: [
      {
        key: 'activeMembership',
        label: t('settings.activeMembership'),
        component: (
          <Box
            justify="between"
            align="start"
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <Text>{userMembership?.type}</Text>
            <Anchor
              onClick={manageInvoiceAndPayments}
              label={<Text size="small">Manage Invoice & Payments</Text>}
            />
          </Box>
        ),
      },
      {
        key: 'membershipPlans',
        label: t('settings.membershipPlans'),
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            round="small"
            gap="small"
            pad="xxsmall"
          >
            {membershipInfo.membershipList.map((membership, index) => (
              <MembershipCard
                key={membership.id}
                index={index}
                userMembershipIndex={membershipInfo.userMembershipIndex}
                membership={membership}
              />
            ))}
          </Box>
        ),
      },
    ],
  };
};

export default MembershipSettings;
