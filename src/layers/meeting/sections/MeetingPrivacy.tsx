import React, { FC } from 'react';
import { Box, FormField, Select } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import SectionContainer from '../../../components/utils/SectionContainer';
import MeetingCheckbox from '../components/MeetingCheckbox';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { validators } from '../../../helpers/validators';

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
  const options = [
    { label: 'option 1', value: 1 },
    { label: 'option 2', value: 2 },
    { label: 'option 3', value: 3 },
  ]; // will be channels for the current zone later

  return (
    <>
      <SectionContainer label="Joining">
        {!selectedUserZone ? (
          <Box justify="between" direction="row">
            <MeetingCheckbox
              title="Public Meeting"
              width="280px"
              nopad
              value={!!formPayload?.public}
              onChange={(v) => {
                dispatch(
                  setMeetingFormFieldAction({
                    public: v,
                    userContactExclusive: false,
                    channelId: null,
                  })
                );
              }}
            />
            <MeetingCheckbox
              title="Open To Contacts"
              width="280px"
              nopad
              value={!!formPayload?.userContactExclusive}
              onChange={(v) => {
                dispatch(
                  setMeetingFormFieldAction({
                    userContactExclusive: v,
                    public: false,
                    channelId: null,
                  })
                );
              }}
            />
          </Box>
        ) : (
          <Box justify="between" align="center" direction="row">
            <FormField
              label="Select Channel"
              name="select"
              validate={validators.required()}
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
        <Box justify="between" direction="row">
          <MeetingCheckbox
            title="Live stream the meeting?"
            width="280px"
            value={!!formPayload?.liveStream}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  liveStream: v,
                })
              );
            }}
          />
          <MeetingCheckbox
            title="Enable Recording?"
            width="280px"
            value={!!formPayload?.record}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  record: v,
                })
              );
            }}
          />
        </Box>
      </SectionContainer>
      <Box height="20px" />
      <SectionContainer label="Configuration Persistence">
        <Box justify="between" direction="row">
          <MeetingCheckbox
            title="Save Configuration"
            width="280px"
            value={!!formPayload?.saveConfig}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  saveConfig: v,
                })
              );
            }}
          />
        </Box>
      </SectionContainer>
    </>
  );
};

export default MeetingPrivacy;
