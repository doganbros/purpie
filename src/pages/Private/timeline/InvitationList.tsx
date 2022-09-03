import React, { FC, useEffect, useState } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import InvitationListItem from '../../../components/utils/invitation/InvitationListItem';
import InvitationListHeader from '../../../components/utils/invitation/InvitationListHeader';
import Divider from '../../../components/utils/Divider';
import { getInvitationListAction } from '../../../store/actions/activity.action';

const InvitationList: FC = () => {
  const dispatch = useDispatch();

  const {
    activity: { invitations },
  } = useSelector((state: AppState) => state);

  const [seeInvitations, setSeeInvitations] = useState(false);

  useEffect(() => {
    dispatch(getInvitationListAction(5, 0));
  }, []);

  return (
    <Box gap={invitations.total !== 0 ? 'medium' : 'none'}>
      <InvitationListHeader
        count={invitations.total}
        seeAll={() => setSeeInvitations((see) => !see)}
      />
      {seeInvitations && (
        <>
          {invitations.loading && <Text size="small">Loading</Text>}
          {invitations.data.map((invitation, index) => (
            <Box gap="small" key={invitation.id}>
              <InvitationListItem invitation={invitation} />
              {invitations.data.length !== index + 1 && (
                <Divider width="25%" size="1px" />
              )}
            </Box>
          ))}
        </>
      )}
    </Box>
  );
};

export default InvitationList;
