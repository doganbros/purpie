import React, { FC, useState } from 'react';
import { Box, DropButton, Text } from 'grommet';
import { Previous } from 'grommet-icons';
import MeetingInvitation from '../../../layers/meeting/sections/MeetingInvitation';

const InviteContact: FC = () => {
  const [open, setOpen] = useState(false);

  return (
    <DropButton
      primary
      fill="horizontal"
      open={open}
      onOpen={() => {
        setOpen(true);
      }}
      onClose={() => {
        setOpen(false);
      }}
      dropAlign={{ left: 'left', top: 'bottom' }}
      dropProps={{
        background: 'white',
        margin: { vertical: 'small' },
        round: 'small',
        elevation: 'medium',
      }}
      label="Invite People to Pavilion"
      dropContent={
        <Box pad="18px" gap="small">
          <Box direction="row" gap="small" align="center">
            <Previous
              onClick={() => setOpen(false)}
              color="dark"
              size="small"
            />
            <Text size="small" weight="bold">
              Invite People
            </Text>
          </Box>
          <MeetingInvitation />
        </Box>
      }
    />
  );
};

export default InviteContact;
