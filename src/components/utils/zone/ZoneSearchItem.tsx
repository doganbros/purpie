import { Box, Button, Text } from 'grommet';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { joinZoneAction } from '../../../store/actions/zone.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { ZoneListItem } from '../../../store/types/zone.types';
import InitialsAvatar from '../InitialsAvatar';

interface ZoneSearchItemProps {
  zone: ZoneListItem;
}

const ZoneSearchItem: FC<ZoneSearchItemProps> = ({ zone }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    zone: { getUserZones },
  } = useSelector((state: AppState) => state);

  const isJoined = (id: number) =>
    !!getUserZones.userZones?.find((z) => z.zone.id === id);

  return (
    <Box direction="row" align="center" gap="small" key={zone.id}>
      <Box flex={{ shrink: 0 }}>
        <InitialsAvatar value={zone.name} id={zone.id} />
      </Box>
      <Box fill align="end" direction="row" gap="small">
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
        label={t(isJoined(zone.id) ? 'common.joined' : 'common.join')}
      />
    </Box>
  );
};

export default ZoneSearchItem;
