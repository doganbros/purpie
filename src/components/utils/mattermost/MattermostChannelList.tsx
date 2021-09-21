import { Box, List } from 'grommet';
import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';

const MattermostChannelList: FC = () => {
  const {
    zone: { selectedUserZone },
    mattermost: { channels },
  } = useSelector((state: AppState) => state);

  // let avatarId = 4568862;
  return (
    <Box margin={{ top: 'medium' }}>
      <List
        data={Object.keys(channels)
          .map((channelId) => {
            const currentChannel = channels[channelId];
            if (!selectedUserZone && currentChannel.channel.type !== 'D')
              return null;
            if (selectedUserZone && currentChannel.channel.type === 'D')
              return null;
            return { entry: currentChannel.metaData.displayName };
          })
          .filter(Boolean)}
      />
    </Box>
  );
};

export default MattermostChannelList;
