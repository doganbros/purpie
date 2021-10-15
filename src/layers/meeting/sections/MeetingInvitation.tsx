import React, { FC, useRef } from 'react';
import { TextInput, FormField, Box, Text, Avatar } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Close, User } from 'grommet-icons';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  addUserToInvitationsAction,
  getUserSuggestionsForMeetingAction,
  removeUserFromInvitationsAction,
} from '../../../store/actions/meeting.action';
import Divider from '../../../components/utils/Divider';

const MeetingInvitation: FC = () => {
  const debouncer = useDebouncer();
  const textInput = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();

  const {
    auth: { user: currentUser },
    meeting: {
      createMeeting: {
        userSuggestions,
        invitedUsers,
        form: { payload },
      },
    },
  } = useSelector((state: AppState) => state);

  const onChange = (value: string) => {
    dispatch(
      getUserSuggestionsForMeetingAction(
        value,
        [currentUser!.id, ...invitedUsers.map((v) => v.value)],
        payload?.userContactExclusive,
        payload?.channelId
      )
    );
  };

  const removeUserInvitation = (value: number) => {
    dispatch(removeUserFromInvitationsAction(value));
  };

  return (
    <>
      <FormField name="user" htmlFor="userInput">
        <TextInput
          id="userInput"
          ref={textInput}
          name="user"
          placeholder="Type a name, username or email"
          suggestions={userSuggestions.map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName}${
              user.userName ? ` @${user.userName}` : ''
            }`,
          }))}
          onChange={(e: any) => debouncer(() => onChange(e.target.value), 300)}
          onSuggestionSelect={(e) => {
            dispatch(addUserToInvitationsAction(e.suggestion));
            if (textInput.current) textInput.current.value = '';
          }}
        />
      </FormField>
      {invitedUsers.length > 0 && (
        <Box
          overflow={{ vertical: 'scroll' }}
          margin={{ top: 'small' }}
          height="180px"
        >
          <Divider dashed color="status-disabled" />
          {invitedUsers.map((item) => (
            <Box
              direction="row"
              gap="small"
              margin={{ top: 'small' }}
              align="center"
              key={item.value}
            >
              <Avatar round background="black">
                <User color="white" size="medium" />
              </Avatar>
              <Box>
                <Text color="black" size="small">
                  {item.label}
                </Text>
              </Box>
              <Box flex={{ grow: 1 }} align="end">
                <Close
                  size="small"
                  cursor="pointer"
                  onClick={() => removeUserInvitation(item.value)}
                />
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default MeetingInvitation;
