import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Box, Stack, Text } from 'grommet';
import { FormLock } from 'grommet-icons';
import { setSelectedChannelAction } from '../../../store/actions/channel.action';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { UserChannelListItem } from '../../../store/types/channel.types';
import PulsatingCircle from '../../../components/utils/PulsatingCircle';
import './Style.scss';

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
        dispatch(setSelectedChannelAction(c.channel.id));
      }}
      focusIndicator={false}
      key={c.channel.id}
      align="center"
      flex={{ shrink: 0 }}
      round="small"
      pad="small"
      width="110px"
      hoverIndicator={{ elevation: 'indigoLight' }}
      className="position--relative"
    >
      <Stack anchor="top-right">
        <Box>
          <Box
            justify="center"
            align="center"
            className="position--absolute position--center"
            width="60px"
            height="60px"
            // overflow="visible"
            basis="120%"
          >
            {c.livePostCount > 0 && (
              <PulsatingCircle size="50px" color="aqua" />
            )}
            {c.unseenPostCount > 0 && c.livePostCount === 0 && (
              <Box
                border={{ color: 'brand', size: '2px' }}
                width="59px"
                height="59px"
                basis="120%"
                className="position--absolute position--center"
              />
            )}
          </Box>
          <ChannelAvatar
            id={c.channel.id}
            name={c.channel.name}
            src={c.channel.displayPhoto}
          />
        </Box>

        {c.unseenPostCount > 0 && (
          <Box
            width="20px"
            height="20px"
            background="brand"
            round
            justify="center"
            align="center"
          >
            <Box
              width="20px"
              height="20px"
              background="aqua"
              round
              justify="center"
              align="center"
            >
              <Text size="small" weight="bold">
                {c.unseenPostCount > 9 ? '9+' : c.unseenPostCount}
              </Text>
            </Box>
          </Box>
        )}
      </Stack>
      <Box align="center">
        <Box direction="row" gap="xxxsmall" align="center">
          {!c.channel.public && (
            <FormLock color="status-disabled" size="16px" />
          )}
          <EllipsesOverflowText
            textAlign="center"
            size="small"
            color="dark"
            text={c.channel.name}
          />
        </Box>
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
