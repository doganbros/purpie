/* eslint-disable no-unused-vars */
import React, { FC, useState } from 'react';

import { Box, Select, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setMeetingFormFieldAction } from '../../../../store/actions/meeting.action';
import { AppState } from '../../../../store/reducers/root.reducer';
import { MEETING_JOIN_LINK_EXPIRE_TIME_HOURS } from '../../../../helpers/constants';

const ExpirationTime: FC = () => {
  const dispatch = useDispatch();
  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);
  const { t } = useTranslation();
  const [expirationTime, setExpirationTime] = useState(
    formPayload?.joinLinkExpiryAsHours || MEETING_JOIN_LINK_EXPIRE_TIME_HOURS
  );
  const handleExpirationTime = (value: number) => {
    setExpirationTime(value);
    dispatch(
      setMeetingFormFieldAction({
        joinLinkExpiryAsHours: value,
      })
    );
  };
  const [value, setValue] = useState('');
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
            { label: '1 Hour', value: 1 },
            { label: '3 Hours', value: 3 },
            { label: '6 Hours', value: 6 },
            { label: '12 Hours', value: 12 },
            { label: '24 Hours', value: 24 },
            { label: '48 Hours', value: 48 },
          ]}
          value={value}
          valueKey={{ key: 'value', reduce: true }}
          onChange={({ value: nextValue }) => setValue(nextValue)}
          placeholder="24 Hours"
          labelKey="label"
        />
      </Box>
    </Box>
  );
};

export default ExpirationTime;
