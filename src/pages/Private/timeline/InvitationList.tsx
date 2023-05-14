import React, { FC, useState } from 'react';
import { Box, Button, InfiniteScroll, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  INVITATION_AMOUNT_LESS,
  INVITATION_AMOUNT_MORE,
} from '../../../helpers/constants';
import InvitationListItem from '../../../components/utils/invitation/InvitationListItem';
import InvitationListHeader from '../../../components/utils/invitation/InvitationListHeader';
import Divider from '../../../components/utils/Divider';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/invitation.types';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';

const InvitationList: FC = () => {
  const { t } = useTranslation();
  const {
    invitation: { invitations },
  } = useSelector((state: AppState) => state);
  const [displayCount, setDisplayCount] = useState(INVITATION_AMOUNT_LESS);

  // TODO - fix onMore function, it works infinitely
  // const getInvitations = (skip?: number) => {
  //   dispatch(getInvitationListAction(INVITATION_AMOUNT_MORE, skip));
  // };

  const data =
    displayCount === INVITATION_AMOUNT_LESS
      ? invitations.data.slice(0, displayCount)
      : invitations.data;

  if (!invitations.loading && invitations.data.length === 0) return null;
  return (
    <Box gap="xsmall">
      <Box direction="row" align="center" justify="between">
        <InvitationListHeader
          count={invitations.data.filter((i) => !i.response).length}
        />
        {invitations.data.length > INVITATION_AMOUNT_LESS && (
          <Button
            onClick={() => {
              setDisplayCount((ps) =>
                ps === INVITATION_AMOUNT_LESS
                  ? INVITATION_AMOUNT_MORE
                  : INVITATION_AMOUNT_LESS
              );
            }}
          >
            <Text size="small" color="brand">
              {displayCount === INVITATION_AMOUNT_LESS
                ? t('common.seeMore')
                : t('common.seeLess')}
            </Text>
          </Button>
        )}
      </Box>
      {invitations.loading && data.length === 0 && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
      )}
      {!invitations.loading && data.length === 0 && (
        <Text size="small">{t('Invitations.noInvitations')}</Text>
      )}

      <Box overflow="auto" height={{ max: '472px' }}>
        <InfiniteScroll
          step={6}
          items={data}
          onMore={() => {
            // getInvitations(invitations.data.length);
          }}
        >
          {(invitation: InvitationListItemType, index: number) => (
            <Box height={{ min: 'unset' }} gap="small" key={invitation.id}>
              <InvitationListItem invitation={invitation} />
              {data.length !== index + 1 && <Divider width="25%" size="1px" />}
            </Box>
          )}
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default InvitationList;
