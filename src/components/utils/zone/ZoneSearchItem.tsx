import { Avatar, Box, Button, Text } from 'grommet';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { joinZoneAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ZoneListItem } from '../../../store/types/zone.types';

interface ZoneSearchItemProps {
  zone: ZoneListItem;
}

const ZoneSearchItem: FC<ZoneSearchItemProps> = ({ zone }) => {
  const dispatch = useDispatch();
  const {
    zone: { getUserZones },
  } = useSelector((state: AppState) => state);

  const isJoined = (id: number) =>
    !!getUserZones.userZones?.find((z) => z.zone.id === id);

  return (
    <Box direction="row" align="center" gap="small" key={zone.id}>
      <Avatar background="#eee" round size="medium" />
      <Box fill align="center" direction="row" gap="small">
        <Text color="brand" weight="bold">
          {zone.name}
        </Text>
        <Text color="status-disabled" size="small">
          {zone.description}
        </Text>
      </Box>
      <Button
        disabled={isJoined(zone.id)}
        onClick={() => dispatch(joinZoneAction(zone.id))}
        primary
        label={isJoined(zone.id) ? 'Joined' : 'Join'}
      />
    </Box>
  );
};

export default ZoneSearchItem;
