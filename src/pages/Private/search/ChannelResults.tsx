import React, { FC } from 'react';
import { Box, InfiniteScroll } from 'grommet';
import ChannelSearchItem from '../../../components/utils/channel/ChannelSearchItem';
import { ChannelListItem } from '../../../store/types/channel.types';

interface ChannelResultsProps {
  channels: ChannelListItem[];
  onMore: () => any;
}
const ChannelResults: FC<ChannelResultsProps> = ({ channels, onMore }) => (
  <InfiniteScroll step={6} items={channels} onMore={onMore}>
    {(item: ChannelListItem) => (
      <Box margin={{ vertical: 'xsmall' }}>
        <ChannelSearchItem channel={item} />
      </Box>
    )}
  </InfiniteScroll>
);

export default ChannelResults;
