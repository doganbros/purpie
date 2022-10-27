import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  setSelectedChannelAction,
  unsetSelectedChannelAction,
} from '../../../store/actions/channel.action';
import InitialsAvatar from '../../../components/utils/InitialsAvatar';
import EllipsesOverflowText from '../../../components/utils/EllipsesOverflowText';

const ChannelList: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    channel: { selectedChannel, userChannels },
    zone: { selectedUserZone },
  } = useSelector((state: AppState) => state);

  const userChannelsFiltered: typeof userChannels = selectedUserZone
    ? {
        ...userChannels,
        data: userChannels.data.filter(
          (c) => c.channel.zoneId === selectedUserZone.zone.id
        ),
      }
    : userChannels;

  return (
    <Box fill direction="row" align="center">
      {userChannelsFiltered.loading && (
        <Text size="small">{t('common.loading')}</Text>
      )}
      {!userChannelsFiltered.loading &&
        (userChannelsFiltered.data.length === 0 ? (
          <Text size="small">
            {t('ChannelList.noFollowedChannel', {
              zone: selectedUserZone ? t('ChannelList.onThisZone') : '',
            })}
          </Text>
        ) : (
          userChannelsFiltered.data.map((c) => (
            <Box
              onClick={() => {
                if (c.channel.id === selectedChannel?.channel.id)
                  dispatch(unsetSelectedChannelAction());
                else dispatch(setSelectedChannelAction(c));
              }}
              focusIndicator={false}
              key={c.channel.id}
              align="center"
              flex={{ shrink: 0 }}
              round="small"
              pad="small"
              background={
                selectedChannel?.channel.id === c.channel.id ? 'brand' : ''
              }
            >
              <InitialsAvatar id={c.channel.id} value={c.channel.name} />
              <EllipsesOverflowText
                textAlign="center"
                size="small"
                color={
                  c.channel.id === selectedChannel?.channel.id
                    ? 'light-1'
                    : 'dark'
                }
              >
                {c.channel.name}
              </EllipsesOverflowText>
            </Box>
          ))
        ))}
    </Box>
  );
};

export default ChannelList;
