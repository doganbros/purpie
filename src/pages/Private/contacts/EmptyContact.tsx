import { Box, Image, Text } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyContactImage from '../../../assets/contact/empty-contact.svg';
import SearchBar from '../../../components/utils/SearchBar';
import { SearchScope } from '../../../models/utils';

const EmptyContact: FC = () => {
  const { t } = useTranslation();

  return (
    <Box height="100vh" justify="center" width="100%">
      <Box alignSelf="center">
        <Image src={EmptyContactImage} />
      </Box>
      <Box margin={{ top: 'large' }} align="center">
        <Text
          size="large"
          weight={600}
          textAlign="center"
          margin="xxsmall"
          color="dark"
        >
          {t('EmptyContact.title')}
        </Text>
        <Box width={{ max: '460px' }}>
          <Text size="small" textAlign="center" color="status-disabled">
            {t('EmptyContact.description')}
          </Text>
        </Box>
      </Box>
      <Box
        margin="medium"
        alignSelf="center"
        width={{ width: '100%', max: '320px' }}
      >
        <SearchBar scope={SearchScope.profile} />
      </Box>
    </Box>
  );
};

export default EmptyContact;
