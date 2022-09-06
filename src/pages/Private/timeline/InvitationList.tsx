import React, { FC, useEffect, useState } from 'react';
import { Box, InfiniteScroll, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import InvitationListItem from '../../../components/utils/invitation/InvitationListItem';
import InvitationListHeader from '../../../components/utils/invitation/InvitationListHeader';
import { getInvitationListAction } from '../../../store/actions/activity.action';
import { InvitationListItem as InvitationListItemType } from '../../../store/types/activity.types';

const InvitationList: FC = () => {
  const dispatch = useDispatch();

  const {
    activity: { invitations },
  } = useSelector((state: AppState) => state);

  const [seeInvitations, setSeeInvitations] = useState(false);

  useEffect(() => {
    getInvitations();
  }, []);

  const getInvitations = (skip?: number) => {
    dispatch(getInvitationListAction(5, skip));
  };

  const renderResults = () => {
    return (
      <InfiniteScroll
        items={invitations.data}
        onMore={() => {
          // getInvitations(invitations.data.length);
        }}
      >
        {(invitation: InvitationListItemType) => (
          <InvitationListItem key={invitation.id} invitation={invitation} />
        )}
      </InfiniteScroll>
    );
  };

  return (
    <Box>
      <InvitationListHeader
        count={invitations.data.filter((i) => !i.response).length}
        seeAll={() => setSeeInvitations((see) => !see)}
      />
      {seeInvitations && (
        <Box gap="small">
          {invitations.loading && <Text size="small">Loading</Text>}
          {renderResults()}
        </Box>
      )}
    </Box>
  );
};

export default InvitationList;
