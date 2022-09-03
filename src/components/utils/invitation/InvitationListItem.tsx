import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import InitialsAvatar from '../InitialsAvatar';

// interface InvitationListItemProps {}

const InvitationListItem: FC = () => {
  return (
    <Box gap="xsmall">
      <Text size="xsmall" weight={500} color="#3D138D">
        Maaike invited you to UX Design channel.
      </Text>
      <Box direction="row" justify="between" align="center">
        <Box direction="row" align="center" gap="small">
          <InitialsAvatar id={1} value="UX DESIGN" />
          <Box>
            <Text size="small" weight={500} color="#202631">
              UX DESIGN
            </Text>
            <Text size="10px" color="status-disabled">
              #UXDESIGN
            </Text>
          </Box>
        </Box>
        <Box direction="row" gap="xsmall">
          <Button primary>
            <Box
              pad={{ vertical: 'xsmall', horizontal: 'medium' }}
              direction="row"
              align="center"
            >
              <Text size="xsmall" weight={500}>
                Join
              </Text>
            </Box>
          </Button>
          <Button plain>
            <Box pad={{ vertical: 'xsmall' }} direction="row" align="center">
              <Text size="xsmall" color="#9060EB" weight={500}>
                Ignore
              </Text>
            </Box>
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default InvitationListItem;
