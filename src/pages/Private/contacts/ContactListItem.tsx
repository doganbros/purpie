import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import { theme } from '../../../config/app-config';
import { ContactUser } from '../../../store/types/user.types';

interface ContactListItemProps {
  contact: ContactUser;
  selected?: boolean;
  onClick: (userName: string) => void;
}

const ContactListItem: FC<ContactListItemProps> = ({
  selected,
  contact,
  onClick,
}) => (
  <Box
    onClick={() => onClick(contact.contactUser.userName)}
    background={selected ? 'brand' : ''}
    focusIndicator={false}
    direction="row"
    justify="between"
    align="center"
    round="small"
    width={{
      width: selected
        ? `calc(100% + 2*${theme.global?.edgeSize?.medium})`
        : 'auto',
      max: selected
        ? `calc(100% + 2*${theme.global?.edgeSize?.medium})`
        : 'auto',
    }}
    pad={{
      vertical: 'small',
      horizontal: selected ? 'medium' : '',
    }}
    margin={{
      horizontal: selected ? `-${theme.global?.edgeSize?.medium}` : '',
    }}
  >
    <Box direction="row" align="center" gap="small">
      <InitialsAvatar
        id={contact.id}
        value={`${contact.contactUser.firstName} ${contact.contactUser.lastName}`}
      />
      <Text weight="bold" color={selected ? 'white' : 'brand'}>
        {contact.contactUser.firstName} {contact.contactUser.lastName}
      </Text>
      <Text color={selected ? 'status-disabled-light' : 'status-disabled'}>
        @{contact.contactUser.userName}
      </Text>
    </Box>
    <Text color={selected ? 'accent-3' : 'blue'}>View full profile</Text>
  </Box>
);

export default ContactListItem;
