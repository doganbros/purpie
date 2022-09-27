import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import GradientScroll from '../../../components/utils/GradientScroll';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { listContactsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';

const UserFriends: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const {
    user: { contacts },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(listContactsAction({ userName }));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        Friends
      </Text>
      <GradientScroll>
        <Box direction="row" gap="medium">
          {contacts.loading && <Text size="small">Loading</Text>}
          {!contacts.loading && contacts.data.length === 0 ? (
            <Text size="small">No friends found</Text>
          ) : (
            contacts.data.map((contact) => (
              <Box key={contact.id} gap="small" align="center">
                <InitialsAvatar
                  id={contact.id}
                  value={contact.contactUser.fullName}
                />
                <Box align="center">
                  <Text size="small" weight="bold">
                    {contact.contactUser.fullName}
                  </Text>
                  <Text size="small" color="status-disabled">
                    @{contact.contactUser.userName}
                  </Text>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </GradientScroll>
    </Box>
  );
};

export default UserFriends;
