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

const MeetingMoreSetting: FC<Props> = ({}) => {
  const handleSubmit: FormSubmitEvent<Payload> = ({ value }) => {};

  const joinSection = ['Lorem Ipsum', 'Lorem Ipsum'];
  const streamSection = [
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
    'Lorem Ipsum',
  ];
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
              title={streamSection[i]}
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
      </SectionContainer>
      <Box height="20px" />
      <SectionContainer label="Lorem Ipsum">
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
    </Form>
  );
};

export default MeetingMoreSetting;
