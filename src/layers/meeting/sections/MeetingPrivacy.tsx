import React, { FC, useContext } from 'react';
import { Box, FormField, Grid, ResponsiveContext, Select } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import SectionContainer from '../../../components/utils/SectionContainer';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { validators } from '../../../helpers/validators';
import Switch from '../../../components/utils/Switch';

const MeetingPrivacy: FC = () => {
  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
    zone: { selectedUserZone },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);
  const options = [
    { label: 'option 1', value: 1 },
    { label: 'option 2', value: 2 },
    { label: 'option 3', value: 3 },
  ]; // will be channels for the current zone later

  return (
    <>
      <SectionContainer label="Joining">
        {!selectedUserZone ? (
          <Grid
            columns={size === 'small' ? 'full' : { count: 2, size: 'small' }}
            gap={{ column: 'xlarge', row: 'small' }}
          >
            <Switch
              label="Public Meeting"
              fill="vertical"
              value={!!formPayload?.public}
              onChange={(v) => {
                dispatch(
                  setMeetingFormFieldAction({
                    public: v,
                    userContactExclusive: !v,
                    channelId: null,
                  })
                );
              }}
            />
            <Switch
              label="Open To Contacts"
              fill="vertical"
              value={!!formPayload?.userContactExclusive}
              onChange={(v) => {
                dispatch(
                  setMeetingFormFieldAction({
                    userContactExclusive: v,
                    public: !v,
                    channelId: null,
                  })
                );
              }}
            />
          </Grid>
        ) : (
          <Box justify="between" align="center" direction="row">
            <FormField
              label="Select Channel"
              name="select"
              validate={validators.required('Select channel')}
            >
              <Select
                name="select"
                placeholder="Choose"
                options={options}
                labelKey="label"
                valueKey="value"
              />
            </FormField>
          </Box>
        )}
      </SectionContainer>
      <Box height="20px" />
      <SectionContainer label="Streaming &amp; Recording">
        <Grid
          columns={size === 'small' ? 'full' : { count: 2, size: 'small' }}
          gap={{ column: 'xlarge', row: 'small' }}
        >
          <Switch
            label="Live stream the meeting?"
            fill="vertical"
            value={!!formPayload?.liveStream}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  liveStream: v,
                })
              );
            }}
          />
          <Switch
            label="Enable Recording?"
            fill="vertical"
            value={!!formPayload?.record}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  record: v,
                })
              );
            }}
          />
        </Grid>
      </SectionContainer>
    </>
  );
};

export default MeetingPrivacy;
