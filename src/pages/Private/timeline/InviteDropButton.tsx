import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import ChannelBadge from '../../../components/utils/channel/ChannelBadge';

interface InviteDropButtonProps {
  channelName: string;
}

const InviteDropButton: FC<InviteDropButtonProps> = ({ channelName }) => {
  // const [open, setOpen] = useState(false);
  // const textInput = useRef<HTMLInputElement>(null);
  // const debouncer = useDebouncer();

  return (
    <Box gap="small">
      <Text color="brand" weight="bold" size="small">
        Invite People to{' '}
        <ChannelBadge
          textProps={{ size: 'small', weight: 'bold' }}
          url="/"
          name={channelName}
        />
      </Text>
    </Box>
  );
};

export default InviteDropButton;
