import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { theme } from '../../../config/app-config';
import { ContactUser } from '../../../store/types/user.types';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';

interface ContactListItemProps {
  contact: ContactUser;
  selected?: boolean;
  onClick: (contact: ContactUser) => void;
}

const ContactListItem: FC<ContactListItemProps> = ({
  selected,
  contact,
  onClick,
}) => {
  const history = useHistory();
  const { t } = useTranslation();
  return (
    <Box
      onClick={() => onClick(contact)}
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
        <UserAvatar
          id={contact.contactUser.id}
          name={contact.contactUser.fullName}
          src={contact.contactUser.displayPhoto}
        />
        <Box direction="column">
          <Text weight="bold" color={selected ? 'white' : 'brand'}>
            {contact.contactUser.fullName}
          </Text>
          <Text color={selected ? 'status-disabled-light' : 'status-disabled'}>
            @{contact.contactUser.userName}
          </Text>
        </Box>
      </Box>
      <Text
        onClick={(e) => {
          e.stopPropagation();
          history.push(`/user/${contact.contactUser.userName}`);
        }}
        color={selected ? 'accent-3' : 'blue'}
      >
        {t('ContactListItem.viewProfile')}
      </Text>
    </Box>
  );
};

export default ContactListItem;
