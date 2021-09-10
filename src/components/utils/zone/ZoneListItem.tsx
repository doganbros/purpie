import React, { FC } from 'react';
import { Avatar, Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinZoneAction } from '../../../store/actions/zone.action';

interface ZoneListItemProps {
  id: number;
  name: string;
  channelCount: number;
  memberCount: number;
  src: string;
}
const ZoneListItem: FC<ZoneListItemProps> = ({
  id,
  name,
  channelCount,
  memberCount,
  src,
}) => {
  const dispatch = useDispatch();
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  const isJoined =
    !!userZones && userZones.filter((z) => z.zone.id === id).length > 0;

  return (
    <Box direction="row" justify="between" align="center">
      <Box direction="row" align="center" gap="small">
        <Avatar size="medium" src={src} />
        <Box>
          <Text size="small" weight="bold">
            {name}
          </Text>
          <Text size="xsmall" color="status-disabled">
            {channelCount} channels
          </Text>
          <Text size="xsmall" color="status-disabled">
            {memberCount} members
          </Text>
        </Box>
      </Box>
      <Button
        primary={!isJoined}
        onClick={() => {
          dispatch(joinZoneAction(id));
        }}
        disabled={isJoined}
        label={isJoined ? 'Joined' : 'Join'}
        size="small"
      />
    </Box>
  );
};

export default ZoneListItem;
