import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from 'grommet';
import { FormLock } from 'grommet-icons';
import { unsetSelectedChannelAction } from '../../../store/actions/channel.action';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { UserChannelListItem } from '../../../store/types/channel.types';
import { AppState } from '../../../store/reducers/root.reducer';
import { apiURL } from '../../../config/http';
import PulsatingCircle from '../../../components/utils/PulsatingCircle';
import imagePlaceholder from '../../../assets/banner-placeholder.jpg';

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
  const {
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

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
      style={{ position: 'relative' }}
      background={{
        opacity: 0.6,
        image: selectedChannel?.channel?.backgroundPhoto
          ? `url(${apiURL}/channel/background-photo/${selectedChannel?.channel?.backgroundPhoto})`
          : `url(${imagePlaceholder})`,
      }}
    >
      <Box
        fill
        style={{
          backdropFilter: 'blur(20px)',
          position: 'absolute',
          zIndex: 0,
        }}
      />

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
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
            width="60px"
            height="60px"
            // overflow="visible"
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
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  borderRadius: '50%',
                }}
              />
            )}
          </Box>
        </Box>

        <Box align="center" margin={{ top: '10px' }} style={{ zIndex: 1 }}>
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
