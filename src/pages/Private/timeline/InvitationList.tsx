import React, { FC, useEffect, useState } from 'react';
import { Box, Button, InfiniteScroll, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { getInvitationListAction } from '../../../store/actions/activity.action';
import {
  INVITATION_AMOUNT_LESS,
  INVITATION_AMOUNT_MORE,
} from '../../../helpers/constants';
import InvitationListItem from '../../../components/utils/invitation/InvitationListItem';
import InvitationListHeader from '../../../components/utils/invitation/InvitationListHeader';
import Divider from '../../../components/utils/Divider';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/activity.types';

const InvitationList: FC = () => {
  const dispatch = useDispatch();
  const {
    activity: { invitations },
  } = useSelector((state: AppState) => state);
  const [displayCount, setDisplayCount] = useState(INVITATION_AMOUNT_LESS);

  useEffect(() => {
    getInvitations();
  }, []);

  const getInvitations = (skip?: number) => {
    dispatch(getInvitationListAction(INVITATION_AMOUNT_MORE, skip));
  };

  const data = invitations.data.slice(0, displayCount);
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
                ? 'See more'
                : 'See less'}
            </Text>
          </Button>
        )}
      </Box>
      {invitations.loading && data.length === 0 && (
        <Text size="small">Loading</Text>
      )}
      {!invitations.loading && data.length === 0 && (
        <Text size="small">No invitations found</Text>
      )}

      <Box overflow="auto" style={{ maxHeight: '472px' }}>
        <InfiniteScroll
          step={6}
          items={data}
          onMore={() => {
            getInvitations(invitations.data.length);
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
