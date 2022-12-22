import React, { FC, useRef } from 'react';
import { TextInput, FormField, Box, Text, Avatar, Button } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Close, User } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        [currentUser!.id, ...invitedUsers.map((v) => v.id)],
        payload?.channelId
      )
    );
  };

  const removeUserInvitation = (id: number) => {
    dispatch(removeUserFromInvitationsAction(id));
  };

  return (
    <>
      <FormField name="user" htmlFor="userInput">
        <TextInput
          id="userInput"
          ref={textInput}
          name="user"
          placeholder={t('MeetingInvitation.placeholder')}
          suggestions={userSuggestions.map((user) => ({
            value: user,
            label: `${user.fullName}${
              user.userName ? ` @${user.userName}` : ''
            }`,
          }))}
          onChange={(e: any) => debouncer(() => onChange(e.target.value), 300)}
          onSuggestionSelect={(e) => {
            dispatch(addUserToInvitationsAction(e.suggestion.value));
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
              gap="medium"
              margin={{ top: 'small' }}
              align="center"
              key={item.id}
            >
              <Avatar round background="dark-1">
                <User color="white" size="medium" />
              </Avatar>
              <Box>
                <Text size="small" weight="bold">
                  {item.fullName}
                </Text>
                <Text size="xsmall">
                  {item.userName && `@${item.userName}`}
                </Text>
              </Box>
              <Box flex={{ grow: 1 }} align="end">
                <Button
                  plain
                  onClick={() => removeUserInvitation(item.id)}
                  icon={<Close color="status-disabled" />}
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
