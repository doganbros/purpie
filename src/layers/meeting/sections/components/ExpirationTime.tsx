/* eslint-disable no-unused-vars */
import React, { FC, useState } from 'react';

import { Box, Select, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setMeetingFormFieldAction } from '../../../../store/actions/meeting.action';
import { AppState } from '../../../../store/reducers/root.reducer';

const ExpirationTime: FC = () => {
  const dispatch = useDispatch();
  const {
    meeting: {
      userMeetingConfig: { config },
    },
  } = useSelector((state: AppState) => state);
  const { t } = useTranslation();

  const joinLinkExpiryAsHours = config?.privacyConfig?.joinLinkExpiryAsHours;
  const [expirationTime, setExpirationTime] = useState('24');
  const handleExpirationTime = (value: any) => {
    dispatch(
      setMeetingFormFieldAction({
        joinLinkExpiryAsHours: Number(value),
      })
    );
  };

  return (
    <Box
      direction="row"
      justify="between"
      pad={{ horizontal: 'small' }}
      align="center"
    >
      <Text size="small" color="dark-6">
        {t('meetingConfig.meetingLinkExpires')}
      </Text>
      <Box width="150px" height="xxxsmall">
        <Select
          options={[
            { label: `${1} ${t('common.hour')}`, value: '1' },
            { label: `${3} ${t('common.hours')}`, value: '3' },
            { label: `${6} ${t('common.hours')}`, value: '6' },
            { label: `${12} ${t('common.hours')}`, value: '12' },
            { label: `${24} ${t('common.hours')}`, value: '24' },
            { label: `${48} ${t('common.hours')}`, value: '48' },
          ]}
          value={expirationTime}
          valueKey={{ key: 'value', reduce: true }}
          onChange={({ value: joinLinkExpirationTime }) => {
            handleExpirationTime(joinLinkExpirationTime);
            setExpirationTime(joinLinkExpirationTime);
          }}
          placeholder={`${joinLinkExpiryAsHours} ${t('common.hours')}`}
          labelKey="label"
        />
      </Box>
    </Box>
  );
};

export default ExpirationTime;
