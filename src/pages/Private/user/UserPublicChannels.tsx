import { Box, Text } from 'grommet';
import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import GradientScroll from '../../../components/utils/GradientScroll';
import { listUserPublicChannelsAction } from '../../../store/actions/user.action';
import { AppState } from '../../../store/reducers/root.reducer';
import PurpieLogoAnimated from '../../../assets/purpie-logo/purpie-logo-animated';
import { ChannelAvatar } from '../../../components/utils/Avatars/ChannelAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';
import { setSelectedChannelAction } from '../../../store/actions/channel.action';

const UserPublicChannels: FC<{ userName: string }> = ({ userName }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    user: { publicChannels },
  } = useSelector((state: AppState) => state);
  const history = useHistory();

  useEffect(() => {
    dispatch(listUserPublicChannelsAction(userName));
  }, []);

  return (
    <Box gap="medium">
      <Text size="large" color="brand" weight="bold">
        {t('UserPublicChannels.title')}
      </Text>
      {publicChannels.loading && (
        <PurpieLogoAnimated width={50} height={50} color="#9060EB" />
      )}
      {!publicChannels.loading && publicChannels.data.length === 0 ? (
        <Text size="small">{t('UserPublicChannels.noChannelsFound')}</Text>
      ) : (
        <GradientScroll>
          <Box direction="row" gap="medium">
            {publicChannels.data.map(({ channel }) => (
              <Box
                key={channel.id}
                gap="small"
                align="center"
                width={{ min: '102px' }}
                onClick={() => {
                  dispatch(setSelectedChannelAction(channel.id));
                  history.push('/');
                }}
              >
                <ChannelAvatar
                  id={channel.id}
                  name={channel.name}
                  src={channel.displayPhoto}
                />
                <Box align="center">
                  <EllipsesOverflowText
                    textAlign="center"
                    size="small"
                    text={channel.name}
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

export default UserPublicChannels;
