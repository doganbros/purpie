import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';

interface InvitationListHeaderProps {
  count: number;
  seeAll: () => void;
}

const InvitationListHeader: FC<InvitationListHeaderProps> = ({
  count,
  seeAll,
}) => {
  return (
    <Box direction="row" justify="between">
      <Box direction="row" gap="small" align="center">
        <Text color="#3D138D" size="small" weight="bold">
          Invitations
        </Text>
        <Box
          background="#6FFFB0"
          round="full"
          width="28px"
          height="28px"
          align="center"
          justify="center"
        >
          <Text color="#3D138D" size="small" weight="bold">
            {count}
          </Text>
        </Box>
      </Box>

      {count !== 0 && (
        <Button onClick={() => seeAll()}>
          <Text size="small" color="#3D138D" weight={500}>
            See all
          </Text>
        </Button>
      )}
    </Box>
  );
};

export default InvitationListHeader;
