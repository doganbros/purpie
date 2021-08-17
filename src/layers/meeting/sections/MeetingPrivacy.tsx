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

interface Props {}

const MeetingPrivacy: FC<Props> = ({}) => {
  const handleSubmit: FormSubmitEvent<Payload> = ({ value }) => {};

  const joinSection = ['Private Meeting', 'Open for channel followers?'];
  const streamSection = ['Live stream the meeting?', 'Enable recording?'];
  const streamSubSection = [
    'Stream to the channel?',
    'Stream to the zone?',
    'Stream to public?',
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
              title={item}
              width="280px"
              key={i}
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
              title={item}
              width="280px"
              key={i}
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
              title={item}
              key={i}
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
