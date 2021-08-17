import React, { FC, useEffect, useState } from 'react';
import { Form, TextInput, FormField, Box, Text } from 'grommet';
import { Add, User } from 'grommet-icons';
import { CreateMeetingPayload } from '../../../store/types/meeting.types';
import { validators } from '../../../helpers/validators';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { UserZone } from '../../../store/types/zone.types';

interface Payload extends CreateMeetingPayload {
  userZone: UserZone;
}

interface Props {}
const users = [
  'umit@doganbros.com',
  'koray@doganbros.com',
  'anas@doganbros.com',
  'kusi@doganbros.com',
  'tolga@doganbros.com',
  'seyma@doganbros.com',
];

const MeetingInvitation: FC<Props> = () => {
  const [suggestionsList, setSuggestionsList] = useState<string[]>(users);
  const [invitedUsers, setInvitedUsers] = useState<string[]>([]);
  const [invitedUser, setInvitedUser] = useState<string>('');

  const handleSubmit: FormSubmitEvent<Payload> = () => {};

  const onChange = (value: string) => {
    setInvitedUser(value);
    const filteredUsers = users.filter((item) => item.includes(value));
    setSuggestionsList(filteredUsers);
  };

  const addUser = () => {
    if (!users.includes(invitedUser)) {
      return null;
    }
    const temp = JSON.parse(JSON.stringify(invitedUsers));
    temp.push(invitedUser);
    setInvitedUsers(temp);
    setInvitedUser('');
  };

  useEffect(() => {}, [invitedUsers]);
  return (
    <Form onSubmit={handleSubmit}>
      <FormField
        name="user"
        htmlFor="userInput"
        validate={validators.required()}
      >
        <TextInput
          id="userInput"
          name="user"
          placeholder="Type a name or email"
          suggestions={suggestionsList}
          onChange={(e: any) => onChange(e.target.value)}
          value={invitedUser}
          onSuggestionSelect={(e) => {
            setInvitedUser(e.suggestion);
          }}
        />
      </FormField>
      <Box
        direction="row"
        align="center"
        onClick={() => {
          addUser();
        }}
        focusIndicator={false}
      >
        <Box
          alignSelf="center"
          width="min-content"
          background="white"
          border={{ size: 'small', color: 'brand' }}
          round="large"
          pad={{ vertical: 'xsmall', horizontal: 'xsmall' }}
        >
          <Add color="brand" size="small" />
        </Box>
        <Text
          color="brand"
          size="small"
          margin={{ left: 'small', right: 'xsmall' }}
        >
          Add People
        </Text>
        <Text color="#8F9BB3" size="small">
          from different channel
        </Text>
      </Box>
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
            <Box direction="row" gap="medium" margin={{ top: 'small' }}>
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
                  {item}
                </Text>
                <Text color="#8F9BB3" size="xsmall">
                  Developer
                </Text>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Form>
  );
};

export default MeetingInvitation;
