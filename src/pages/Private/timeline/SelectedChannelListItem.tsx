import React, { FC } from 'react';
import { useDispatch } from 'react-redux';
import { Box } from 'grommet';
import { FormLock } from 'grommet-icons';
import { unsetSelectedChannelAction } from '../../../store/actions/channel.action';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { UserChannelListItem } from '../../../store/types/channel.types';
import { apiURL } from '../../../config/http';
import PulsatingCircle from '../../../components/utils/PulsatingCircle';
import imagePlaceholder from '../../../assets/banner-placeholder.jpg';
import { useSelectedChannel } from '../../../hooks/useSelectedChannel';

interface ChannelListItemProps {
  c: UserChannelListItem;
  handleWaiting?: () => void;
  zoneName: string;
}

const SelectedChannelListItem: FC<ChannelListItemProps> = ({
  c,
  handleWaiting,
  zoneName,
}: ChannelListItemProps) => {
  const dispatch = useDispatch();
  const selectedChannel = useSelectedChannel();

  return (
    <Box
      onClick={() => {
        handleWaiting?.();
        dispatch(unsetSelectedChannelAction());
      }}
      focusIndicator={false}
      key={c.channel.id}
      align="start"
      justify="center"
      flex={{ shrink: 0 }}
      round="small"
      width="150px"
      direction="row"
      overflow="hidden"
      className="position--relative"
      background={{
        opacity: 0.6,
        image: selectedChannel?.channel?.backgroundPhoto
          ? `url(${apiURL}/channel/background-photo/${selectedChannel?.channel?.backgroundPhoto})`
          : `url(${imagePlaceholder})`,
      }}
    >
      <Box fill className="z-index--0 position--absolute backdrop-filter--20" />

      <Box
        height="100%"
        pad={{ bottom: '3px' }}
        justify="center"
        align="center"
        width="150px"
        round="small"
      >
        <Box
          margin={{ top: '5px' }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          <ChannelAvatar
            id={c.channel.id}
            name={c.channel.name}
            src={c.channel.displayPhoto}
          />

          <Box
            justify="center"
            align="center"
            className="position--absolute position--center"
            width="60px"
            height="60px"
            basis="120%"
          >
            {c.livePostCount > 1 && (
              <PulsatingCircle size="50px" color="aqua" />
            )}
            {c.unseenPostCount > 0 && c.livePostCount === 0 && (
              <Box
                border={{ color: 'aqua', size: '2px' }}
                width="59px"
                height="59px"
                basis="120%"
                className="position--absolute position--center"
              />
            )}
          </Box>
        </Box>

        <Box align="center" margin={{ top: '10px' }} className="z-index--1">
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
            size="xsmall"
            color="dark"
            text={zoneName}
            maxWidth="150px"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default SelectedChannelListItem;
