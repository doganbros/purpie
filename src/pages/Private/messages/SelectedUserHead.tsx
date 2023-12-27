import React, { FC } from 'react';
import { Box, Button, Image, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { User } from '../../../store/types/auth.types';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  initiateCallAction,
  leaveCallAction,
} from '../../../store/actions/videocall.action';
import CallInactiveIcon from '../../../assets/video-call/call-inactive.svg';
import ActiveCallIcon from '../../../assets/video-call/active-call.svg';

interface Props {
  user: User | null;
  typingUsers: User[];
}

const SelectedUserHead: FC<Props> = ({ user, typingUsers }) => {
  const {
    chat: { usersOnline },
    videocall: { activeCall, incomingCall, outgoingCall },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  if (user) {
    const userOnline = usersOnline.includes(user.id);
    return (
      <Box>
        <Box direction="row" gap="medium" align="center">
          <Box direction="row" gap="xsmall" align="center">
            <UserAvatar
              id={user.id}
              name={user.fullName}
              src={user.displayPhoto}
            />
            <Box>
              <Text size="small" weight={500} color="dark">
                {user.fullName}
              </Text>
              {typingUsers.map((u) => u.id).includes(user.id) ? (
                <Text size="10px" weight={400} color="brand-alt">
                  Typing...
                </Text>
              ) : (
                <Text size="10px" weight={400} color="status-disabled">
                  {userOnline ? 'Online' : 'Offline'}
                </Text>
              )}
            </Box>
          </Box>
          {!activeCall && !outgoingCall && !incomingCall && (
            <Button onClick={() => dispatch(initiateCallAction(user))}>
              <Image src={CallInactiveIcon} height={30} width={54} />
            </Button>
          )}
          {outgoingCall && (
            <Button onClick={() => dispatch(leaveCallAction(outgoingCall.id))}>
              <Image src={ActiveCallIcon} height={30} width={54} />
            </Button>
          )}
        </Box>
      </Box>
    );
  }
  return null;
};

export default SelectedUserHead;
