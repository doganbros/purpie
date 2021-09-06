import React, { FC, useRef } from 'react';
import { TextInput, FormField, Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Close, User } from 'grommet-icons';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  addUserToInvitationsAction,
  getUserSuggestionsForMeetingAction,
  removeUserFromInvitationsAction,
} from '../../../store/actions/meeting.action';

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
          border={{
            side: 'top',
            color: '#8F9BB3',
            size: 'xsmall',
            style: 'dashed',
          }}
        >
          {invitedUsers.map((item) => (
            <Box
              direction="row"
              gap="medium"
              margin={{ top: 'small' }}
              align="center"
              key={item.value}
            >
              <Box
                border={{ size: 'small', color: 'black' }}
                round="large"
                background="black"
                pad={{ vertical: 'xsmall', horizontal: 'xsmall' }}
              >
                <User color="white" size="medium" />
              </Box>
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
