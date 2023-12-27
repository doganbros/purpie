import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import GradientScroll from '../../../components/utils/GradientScroll';
import { listUserPublicZonesAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import InitialsAvatar from '../../../components/utils/Avatars/InitialsAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { navigateToSubdomain } from '../../../helpers/app-subdomain';

const UserPublicZones: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { publicZones },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(listUserPublicZonesAction(userName));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        {t('UserPublicZones.title')}
      </Text>
      {publicZones.loading && <Text size="small">Loading</Text>}
      {!publicZones.loading && publicZones.data.length === 0 ? (
        <Text size="small">{t('UserPublicZones.noZonesFound')}</Text>
      ) : (
        <GradientScroll>
          <Box direction="row" gap="medium">
            {publicZones.data.map(({ zone }) => (
              <Box
                key={zone.id}
                gap="small"
                align="center"
                width={{ min: '102px' }}
                onClick={() => navigateToSubdomain(zone.subdomain)}
              >
                <InitialsAvatar id={zone.id} value={zone.name} round="small" />
                <Box align="center">
                  <EllipsesOverflowText
                    textAlign="center"
                    size="small"
                    text={zone.name}
                  />
                  <EllipsesOverflowText
                    textAlign="center"
                    size="small"
                    text={zone.subdomain}
                    color="status-disabled"
                  />
                </Box>
              </Box>
            ))}
          </Box>
        </GradientScroll>
      )}
    </Box>
  );
};

export default UserPublicZones;
