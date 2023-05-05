import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Stack } from 'grommet';
import { FormLock } from 'grommet-icons';
import { setSelectedChannelAction } from '../../../store/actions/channel.action';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { UserChannelListItem } from '../../../store/types/channel.types';

interface ChannelListItemProps {
  c: UserChannelListItem;
  handleWaiting?: () => void;
  zoneName: string;
}

const UnselectedChannelListItem: FC<ChannelListItemProps> = ({
  c,
  handleWaiting,
  zoneName,
}: ChannelListItemProps) => {
  const dispatch = useDispatch();

  return (
    <Box
      onClick={() => {
        handleWaiting?.();
        dispatch(setSelectedChannelAction(c));
      }}
      focusIndicator={false}
      key={c.channel.id}
      align="center"
      flex={{ shrink: 0 }}
      round="small"
      pad="small"
      width="110px"
      hoverIndicator={{ elevation: 'indigoLight' }}
    >
      <Stack anchor="top-right">
        <ChannelAvatar
          id={c.channel.id}
          name={c.channel.name}
          src={c.channel.displayPhoto}
        />
        {!c.channel.public && (
          <Box
            width="20px"
            height="20px"
            background="brand"
            round
            justify="center"
            align="center"
          >
            <FormLock color="white" size="16px" />
          </Box>
        )}
      </Stack>
      <Box align="center">
        <EllipsesOverflowText
          textAlign="center"
          size="small"
          color="dark"
          text={c.channel.name}
        />
        <EllipsesOverflowText
          textAlign="center"
          size="small"
          color="status-disabled"
          text={zoneName}
        />
      </Box>
    </Box>
  );
};

export default UnselectedChannelListItem;
