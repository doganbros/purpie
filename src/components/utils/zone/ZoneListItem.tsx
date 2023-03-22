import React, { FC } from 'react';
import { Box, Button, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { joinZoneAction } from '../../../store/actions/zone.action';
import EllipsesOverflowText from '../EllipsesOverflowText';
import { ZoneAvatar } from '../Avatars/ZoneAvatar';

interface ZoneListItemProps {
  id: string;
  name: string;
  channelCount: number;
  memberCount: number;
  displayPhoto: string;
}

const ZoneListItem: FC<ZoneListItemProps> = ({
  id,
  name,
  channelCount,
  memberCount,
  displayPhoto,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  const isJoined =
    !!userZones &&
    userZones.filter((z) => z.zone.id === id && z?.id !== null).length > 0;

  return (
    <Box direction="row" justify="between" align="center">
      <Box direction="row" align="center" gap="small">
        <ZoneAvatar id={id} name={name} src={displayPhoto} />
        <Box>
          <EllipsesOverflowText
            maxWidth="212px"
            lineClamp={1}
            size="small"
            weight="bold"
            text={name}
          />
          <Text size="xsmall" color="status-disabled">
            {t('ZoneListItem.channelCount', { count: channelCount })}
          </Text>
          <Text size="xsmall" color="status-disabled">
            {t('ZoneListItem.memberCount', { count: memberCount })}
          </Text>
        </Box>
      </Box>
      <Button
        primary={!isJoined}
        onClick={() => {
          dispatch(joinZoneAction(id));
        }}
        disabled={isJoined}
        label={t(isJoined ? 'common.joined' : 'common.join')}
        size="small"
      />
    </Box>
  );
};

export default ZoneListItem;
