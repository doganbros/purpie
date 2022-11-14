import { Box, Button, Image, Text } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import EmptyContactImage from '../../../assets/contact/empty-contact.svg';

interface Props {
  onFindContact: () => void;
}

const EmptyContact: FC<Props> = ({ onFindContact }) => {
  const { t } = useTranslation();

  return (
    <Box>
      <Box margin={{ top: 'xlarge' }} alignSelf="center">
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
        <Box width={{ max: '440px' }}>
          <Text size="small" textAlign="center" color="status-disabled">
            {t('EmptyContact.description')}
          </Text>
        </Box>
      </Box>
      <Box margin="medium" width="fit-content" alignSelf="center">
        <Button primary size="small" onClick={onFindContact}>
          <Box pad={{ horizontal: 'large', vertical: 'small' }}>
            <Text textAlign="center">{t('EmptyContact.findContact')}</Text>
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default EmptyContact;
