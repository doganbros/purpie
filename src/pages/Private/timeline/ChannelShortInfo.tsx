import React, { FC } from 'react';
import { Box, Image, Text } from 'grommet';
import { useSelector } from 'react-redux';
import { SettingsOption } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { AppState } from '../../../store/reducers/root.reducer';
import { apiURL } from '../../../config/http';

const ChannelShortInfo: FC = () => {
  const {
    channel: { selectedChannel },
  } = useSelector((state: AppState) => state);

  const history = useHistory();
  const WIDTH = '385px';
  const HEIGHT = '214px';

  return (
    <Box margin={{ bottom: '-60px' }} style={{ position: 'relative' }}>
      <Box
        width={WIDTH}
        height={HEIGHT}
        overflow="hidden"
        style={{ position: 'relative', zIndex: -1 }}
        background="brand"
        round={{ corner: 'top', size: 'small' }}
      >
        {selectedChannel?.channel?.backgroundPhoto && (
          <Image
            src={`${apiURL}/channel/background-photo/${selectedChannel?.channel?.backgroundPhoto}`}
            width="100%"
            height="100%"
            fit="cover"
          />
        )}
        <Box
          width={WIDTH}
          height={HEIGHT}
          style={{ position: 'absolute', top: 0 }}
          justify="end"
          align=""
        >
          <Box
            width={WIDTH}
            height={HEIGHT}
            background="linear-gradient(to bottom, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 1))"
          />
        </Box>
      </Box>
      <Box
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '20px',
        }}
        width="100%"
      >
        <Box
          direction="row"
          gap="xsmall"
          align="center"
          pad={{ left: 'xxsmall' }}
          width="90%"
          justify="between"
        >
          <Text size="small" weight="bold">
            {' '}
            {selectedChannel?.channel.name}
          </Text>

          <Box
            onClick={() =>
              history.push('/settings', {
                selectedChannel,
                selectedIndex: 1,
                showChannelSelector: false,
              })
            }
          >
            <SettingsOption color="brand" />
          </Box>
        </Box>
        {selectedChannel?.channel.description && (
          <Box direction="row" gap="xsmall">
            <Text size="small"> {selectedChannel?.channel.description}</Text>
          </Box>
        )}
      </Box>
    </Box>
  );
  return null;
};

export default ChannelShortInfo;
