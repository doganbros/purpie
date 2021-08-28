import React, { FC, useRef } from 'react';
import { TextInput, FormField, Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { User } from 'grommet-icons';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  addUserToInvitations,
  getUserSuggestionsForMeetingAction,
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

  return (
    <>
      <FormField name="user" htmlFor="userInput">
        <TextInput
          id="userInput"
          ref={textInput}
          name="user"
          placeholder="Type a name or email"
          suggestions={userSuggestions.map((user) => ({
            value: user.id,
            label: `${user.firstName} ${user.lastName} - ${user.email}`,
          }))}
          onChange={(e: any) => debouncer(() => onChange(e.target.value), 300)}
          onSuggestionSelect={(e) => {
            dispatch(addUserToInvitations(e.suggestion));
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
                <Text color="#8F9BB3" size="xsmall">
                  Developer
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </>
  );
};

export default MeetingInvitation;
