import React, { FC } from 'react';
import { Box, InfiniteScroll } from 'grommet';
import ZoneSearchItem from '../../../components/utils/zone/ZoneSearchItem';
import { ZoneListItem } from '../../../store/types/zone.types';

interface ZoneResultsProps {
  zones: ZoneListItem[];
  onMore: () => any;
}
const ZoneResults: FC<ZoneResultsProps> = ({ zones, onMore }) => (
  <InfiniteScroll step={6} items={zones} onMore={onMore}>
    {(item: ZoneListItem) => (
      <Box margin={{ vertical: 'xsmall' }}>
        <ZoneSearchItem zone={item} />
      </Box>
    )}
  </InfiniteScroll>
);

export default ZoneResults;
