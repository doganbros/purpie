import React, { FC, useState } from 'react';
import { Box, Form } from 'grommet';
import { CreateMeetingPayload } from '../../../store/types/meeting.types';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { UserZone } from '../../../store/types/zone.types';
import SectionContainer from '../../../components/utils/SectionContainer';
import MeetingCheckbox from '../components/MeetingCheckbox';

interface Payload extends CreateMeetingPayload {
  userZone: UserZone;
}

const MeetingMoreSetting: FC = () => {
  const handleSubmit: FormSubmitEvent<Payload> = () => {};

  const joinSection = Array(2)
    .fill('')
    .map((v, i) => ({ id: i + 1, title: 'Lorem Ipsum' }));
  const streamSection = Array(8)
    .fill('')
    .map((v, i) => ({ id: i + 1, title: 'Lorem Ipsum' }));

  const [joinSectionSwitches, setJoinSectionSwitches] = useState<boolean[]>([
    false,
    false,
  ]);
  const [streamSectionSwitches, setStreamSectionSwitches] = useState<boolean[]>(
    [false, false, false, false, false, false, false, false]
  );

  return (
    <Form onSubmit={handleSubmit}>
      <SectionContainer label="Lorem Ipsum">
        <Box justify="between" direction="row" wrap>
          {streamSection.map((item, i) => (
            <MeetingCheckbox
              title={item.title}
              width="280px"
              key={item.id}
              onClick={() => {
                const temp = streamSectionSwitches;
                temp[i] = !temp[i];
                setStreamSectionSwitches(temp);
              }}
            />
          ))}
        </Box>
      </SectionContainer>
      <Box height="20px" />
      <SectionContainer label="Lorem Ipsum">
        <Box justify="between" direction="row">
          {joinSection.map((item, i) => (
            <MeetingCheckbox
              title={item.title}
              width="280px"
              key={item.id}
              nopad
              onClick={() => {
                const temp = joinSectionSwitches;
                temp[i] = !temp[i];
                setJoinSectionSwitches(temp);
              }}
            />
          ))}
        </Box>
      </SectionContainer>
    </Form>
  );
};

export default MeetingMoreSetting;
