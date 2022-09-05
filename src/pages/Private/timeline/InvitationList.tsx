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
    getSearchResults(0);
  }, []);

  const getSearchResults = (skip: number) => {
    dispatch(getInvitationListAction(5, skip));
  };

  const renderResults = () => {
    return (
      <InfiniteScroll
        items={invitations.data}
        onMore={() => {
          // TODO onMore function works immediately
          // getSearchResults(invitations.data.length);
        }}
      >
        {(invitation: InvitationListItemType) => (
          <Box gap="small" key={invitation.id}>
            <InvitationListItem invitation={invitation} />
          </Box>
        )}
      </InfiniteScroll>
    );
  };

  return (
    <Box gap={invitations.total !== 0 ? 'medium' : 'none'}>
      <InvitationListHeader
        count={invitations.total}
        seeAll={() => setSeeInvitations((see) => !see)}
      />
      {seeInvitations && (
        <>
          {invitations.loading && <Text size="small">Loading</Text>}
          {renderResults()}
        </>
      )}
    </Box>
  );
};

export default InvitationList;
