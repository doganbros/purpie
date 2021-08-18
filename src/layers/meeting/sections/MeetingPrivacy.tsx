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
const MeetingPrivacy: FC = () => {
  const handleSubmit: FormSubmitEvent<Payload> = () => {};

  const joinSection = [
    { id: 1, title: 'Private Meeting' },
    { id: 2, title: 'Open for channel followers?' },
  ];
  const streamSection = [
    { id: 1, title: 'Live stream the meeting?' },
    { id: 2, title: 'Enable recording?' },
  ];
  const streamSubSection = [
    { id: 1, title: 'Stream to the channel?' },
    { id: 2, title: 'Stream to the zone?' },
    { id: 3, title: 'Stream to public?' },
  ];
  const [joinSectionSwitches, setJoinSectionSwitches] = useState<boolean[]>([
    false,
    false,
  ]);
  const [streamSectionSwitches, setStreamSectionSwitches] = useState<boolean[]>(
    [false, false]
  );
  const [streamSubSectionSwitches, setStreamSubSectionSwitches] = useState<
    boolean[]
  >([false, false, false]);

  return (
    <Form onSubmit={handleSubmit}>
      <SectionContainer label="Joining">
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
      <Box height="20px" />
      <SectionContainer label="Streaming & Recording">
        <Box justify="between" direction="row">
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
        <Box
          pad={{ left: 'small', top: 'xsmall' }}
          border={{ color: '#8F9BB3', size: 'xsmall', side: 'left' }}
        >
          {streamSubSection.map((item, i) => (
            <MeetingCheckbox
              title={item.title}
              key={item.id}
              width="267px"
              onClick={() => {
                const temp = streamSubSectionSwitches;
                temp[i] = !temp[i];
                setStreamSubSectionSwitches(temp);
              }}
            />
          ))}
        </Box>
      </SectionContainer>
    </Form>
  );
};

export default MeetingPrivacy;
