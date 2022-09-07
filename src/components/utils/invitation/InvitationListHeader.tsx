import React, { FC } from 'react';
import { Box, Text } from 'grommet';

interface InvitationListHeaderProps {
  count: number;
}

const InvitationListHeader: FC<InvitationListHeaderProps> = ({ count }) => {
  return (
    <Box direction="row" gap="small" align="center">
      <Text color="#202631" size="small" weight="bold">
        Invitations
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
