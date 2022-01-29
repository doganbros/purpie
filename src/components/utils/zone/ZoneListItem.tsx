import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinZoneAction } from '../../../store/actions/zone.action';
import InitialsAvatar from '../InitialsAvatar';

interface ZoneListItemProps {
  id: number;
  name: string;
  channelCount: number;
  memberCount: number;
}
const ZoneListItem: FC<ZoneListItemProps> = ({
  id,
  name,
  channelCount,
  memberCount,
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
        <InitialsAvatar id={id} value={name} />
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
