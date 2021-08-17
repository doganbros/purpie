import React, { FC, useRef, useState } from 'react';
import { Box, Form, TextInput, TextArea, DateInput, FormField } from 'grommet';
import { CreateMeetingPayload } from '../../../store/types/meeting.types';
import { validators } from '../../../helpers/validators';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { UserZone } from '../../../store/types/zone.types';
import TimeInput from '../../../components/utils/TimeInput';
import MeetingCheckbox from '../components/MeetingCheckbox';

interface Payload extends CreateMeetingPayload {
  userZone: UserZone;
}

interface Props {}

const MeetingDetails: FC<Props> = () => {
  const [swtichActive, setSwtichActive] = useState(false);
  const [time, setTime] = useState<string | undefined>(undefined);
  const defaultDate = useRef(new Date().toISOString());

  const handleSubmit: FormSubmitEvent<Payload> = () => {};

  return (
    <Form onSubmit={handleSubmit}>
      <FormField
        name="name"
        htmlFor="nameInput"
        validate={validators.required()}
      >
        <TextInput id="nameInput" name="name" placeholder="Meeting Name" />
      </FormField>
      <FormField
        name="description"
        htmlFor="description"
        validate={validators.required()}
      >
        <TextArea
          id="descriptionInput"
          name="description"
          resize={false}
          style={{ height: 90 }}
          placeholder="Meeting Description"
        />
      </FormField>
      <MeetingCheckbox
        title="Plan for later"
        width="140px"
        nopad
        onClick={() => {
          setSwtichActive(!swtichActive);
        }}
      />
      {swtichActive && (
        <Box direction="row" gap="small" margin={{ top: 'small' }}>
          <FormField name="date" htmlFor="dateValue" fill="horizontal">
            <DateInput
              format="dd/mm/yyyy"
              defaultValue={defaultDate.current}
              id="dateValue"
              name="date"
              placeholder="Set Date"
            />
          </FormField>
          <FormField name="time" htmlFor="timeValue" fill="horizontal">
            <TimeInput
              onChange={(val: string) => {
                setTime(val);
              }}
              value={time}
            />
          </FormField>
        </Box>
      )}
    </Form>
  );
};

export default MeetingDetails;
