import React, { FC, useState } from 'react';

import { Box, Select, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
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
  return (
    <Box
      direction="row"
      justify="between"
      pad={{ top: 'small' }}
      align="center"
    >
      <Text size="small" color="dark-6">
        Join Link Expires After (Hours)
      </Text>
      <Box width="xsmall" height="xxsmall">
        <Select
          options={[1, 3, 6, 9, 12, 18, 24, 48, 72]}
          value={[expirationTime]}
          onChange={({ option }) => handleExpirationTime(option)}
          placeholder="24"
        />
      </Box>
    </Box>
  );
};

export default ExpirationTime;
