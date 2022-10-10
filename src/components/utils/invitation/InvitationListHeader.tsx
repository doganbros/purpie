import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';

interface InvitationListHeaderProps {
  count: number;
}

const InvitationListHeader: FC<InvitationListHeaderProps> = ({ count }) => {
  const { t } = useTranslation();
  return (
    <Box direction="row" gap="small" align="center">
      <Text color="#202631" size="small" weight="bold">
        {t('Invitations.title')}
      </Text>
      <Box
        background="accent-1"
        round="full"
        width="28px"
        height="28px"
        align="center"
        justify="center"
      >
        <Text color="neutral-2" size="small" weight="bold">
          {count}
        </Text>
      </Box>
    </Box>
  );
};

export default InvitationListHeader;
