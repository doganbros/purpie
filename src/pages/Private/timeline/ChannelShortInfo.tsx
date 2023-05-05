/* eslint-disable no-unused-vars */
import React, { FC } from 'react';
import { Box, Image, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { apiURL } from '../../../config/http';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';

const ChannelShortInfo: FC = () => {
  const {
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const WIDTH_HEIGHT = '385px';

  return (
    <Box margin={{ bottom: '-100px' }} style={{ zIndex: -1 }}>
      <Box
        width={WIDTH_HEIGHT}
        height={WIDTH_HEIGHT}
        overflow="hidden"
        style={{ position: 'relative' }}
        background="brand"
        round={{ corner: 'top', size: 'large' }}
      >
        {selectedChannel?.channel?.backgroundPhoto && (
          <Image
            src={`${apiURL}/channel/background-photo/${selectedChannel?.channel?.backgroundPhoto}`}
            // src={testBackground2}
            width="100%"
            height="100%"
            fit="cover"
          />
        )}
        <Box
          width={WIDTH_HEIGHT}
          height={WIDTH_HEIGHT}
          background="linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1))"
          style={{ position: 'absolute', top: 0 }}
        />
        <Box style={{ position: 'absolute', bottom: '100px', left: '20px' }}>
          <Box direction="row" gap="xsmall" align="center">
            <ChannelAvatar
              id={selectedChannel?.channel?.id || '1'}
              name={selectedChannel?.channel?.name}
              src={selectedChannel?.channel?.displayPhoto}
            />
            <Text size="small" weight="bold">
              {' '}
              {selectedChannel?.channel.name}
            </Text>
          </Box>
          {selectedChannel?.channel.description && (
            <Box direction="row" gap="xsmall">
              <Text size="small"> {selectedChannel?.channel.description}</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
  return null;
};

export default ChannelShortInfo;
