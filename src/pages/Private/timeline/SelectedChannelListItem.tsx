import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Button, Text, Image, DropButton } from 'grommet';
import { unsetSelectedChannelAction } from '../../../store/actions/channel.action';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { UserChannelListItem } from '../../../store/types/channel.types';
import { AppState } from '../../../store/reducers/root.reducer';
import MoreIcon from '../../../assets/icons/more.svg';
import ExtendedBox from '../../../components/utils/ExtendedBox';
import { apiURL } from '../../../config/http';
import PulsatingCircles from '../../../components/utils/PulsatingCircles';

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
      // this is for centering items, triple dots holds 6px
      pad={{ bottom: '6px' }}
      style={{ position: 'relative' }}
      background={{
        opacity: 0.6,
        image: `url(${apiURL}/channel/background-photo/${selectedChannel?.channel?.backgroundPhoto})`,
        color: selectedChannel?.channel?.backgroundPhoto
          ? 'transparent'
          : '#d1bdf7',
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
            <PulsatingCircles size="50px" color="#9060EB" />
          </Box>
        </Box>

        <Box align="center" margin={{ top: '10px' }} style={{ zIndex: 1 }}>
          <EllipsesOverflowText
            textAlign="center"
            size="small"
            color="dark"
            text={c.channel.name}
            maxWidth="150px"
          />
          <EllipsesOverflowText
            textAlign="center"
            size="xsmall"
            color="dark"
            text={zoneName}
            maxWidth="150px"
          />
        </Box>
      </Box>
      <ExtendedBox position="relative" right="10px" top="10px">
        <DropButton
          onClick={(e) => e.stopPropagation()}
          dropContent={
            <Box>
              <Button
                label={
                  <Text size="small" color="white">
                    Unfollow
                  </Text>
                }
                size="small"
                primary
              />
            </Box>
          }
        >
          <Box>
            <Image src={MoreIcon} />
          </Box>
        </DropButton>
      </ExtendedBox>
    </Box>
  );
};

export default SelectedChannelListItem;
