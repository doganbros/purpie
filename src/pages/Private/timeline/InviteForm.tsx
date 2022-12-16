import React, { FC, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, FormField, Text, TextInput, ThemeContext } from 'grommet';
import ChannelBadge from '../../../components/utils/channel/ChannelBadge';
import { useDebouncer } from '../../../hooks/useDebouncer';
import { AppState } from '../../../store/reducers/root.reducer';
import { searchProfileAction } from '../../../store/actions/user.action';
import { ProfileSearchParams } from '../../../store/types/user.types';
import { User } from '../../../store/types/auth.types';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import ZoneBadge from '../../../components/utils/zone/ZoneBadge';
import { CreateFormTheme } from '../../../layers/create-zone/custom-theme';

interface InviteDropButtonProps {
  channelName?: string;
  zoneName?: string;
  zoneSubdomain?: string;
  createInvitation: () => void;
}

const InviteForm: FC<InviteDropButtonProps> = ({
  channelName,
  zoneName,
  zoneSubdomain,
  createInvitation,
}) => {
  const textInput = useRef<HTMLInputElement>(null);
  const debouncer = useDebouncer();
  const dispatch = useDispatch();

  const [invitedUsers, setInvitedUsers] = useState<Array<User>>([]);

  const {
    auth: { user: currentUser },
    user: { search },
  } = useSelector((state: AppState) => state);

  const onChange = (value: string) => {
    const request: ProfileSearchParams = {
      name: value,
      excludeIds: [currentUser!.id, ...invitedUsers.map((v) => v.id)],
    };
    dispatch(searchProfileAction(request));
  };

  return (
    <Box gap="small">
      <Text color="brand" weight="bold" size="small">
        Invite People to{' '}
        {channelName && (
          <ChannelBadge
            textProps={{ size: 'small', weight: 'bold' }}
            url="/"
            name={channelName}
          />
        )}
        {zoneName && (
          <ZoneBadge
            textProps={{ size: 'small', weight: 'bold' }}
            name={zoneName}
            subdomain={zoneSubdomain}
          />
        )}
      </Text>
      <Box>
        <ThemeContext.Extend value={CreateFormTheme}>
          <FormField name="user" htmlFor="userInputForChannel" margin="0">
            <TextInput
              id="userInput"
              ref={textInput}
              name="user"
              placeholder="Type a name or email"
              suggestions={search.results.data.map((user) => ({
                value: user,
                label: `${user.fullName}${
                  user.userName ? ` @${user.userName}` : ''
                }`,
              }))}
              onChange={(e: any) =>
                debouncer(() => onChange(e.target.value), 300)
              }
              onSuggestionSelect={(e) => {
                createInvitation();
                setInvitedUsers((users) => [e.suggestion.value, ...users]);
                if (textInput.current) textInput.current.value = '';
              }}
            />
          </FormField>
        </ThemeContext.Extend>
        {invitedUsers.length > 0 && (
          <Box overflow={{ vertical: 'scroll' }} height={{ max: '180px' }}>
            {invitedUsers.map((item) => (
              <Box
                direction="row"
                gap="small"
                margin={{ top: 'small' }}
                align="center"
                key={item.id}
                height={{ min: '36px' }}
              >
                <UserAvatar
                  size="36px"
                  id={item.id}
                  name={item.fullName}
                  src={item.displayPhoto}
                />
                <Box>
                  <Text size="small" weight={500} color="dark">
                    {item.fullName}
                  </Text>
                  <Text size="10px" color="status-disabled">
                    {item.userName && `@${item.userName}`}
                  </Text>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default InviteForm;