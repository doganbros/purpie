import React, { FC, useState } from 'react';
import { Box, Form, Select, Grommet } from 'grommet';
import { CreateMeetingPayload } from '../../../store/types/meeting.types';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { UserZone } from '../../../store/types/zone.types';
import SectionContainer from '../../../components/utils/SectionContainer';
import MeetingRadioButton from '../components/MeetingRadioButton';
import MeetingCheckbox from '../components/MeetingCheckbox';
import { theme } from '../../../config/app-config';

interface Payload extends CreateMeetingPayload {
  userZone: UserZone;
}

const MeetingSetting: FC = () => {
  const handleSubmit: FormSubmitEvent<Payload> = () => {};

  const [swtichActive, setSwtichActive] = useState(false);
  const [firstSelect, setFirstSelect] = useState('Public');
  const [secondSelect, setSecondSelect] = useState('10 Members');

  const streamSection = [
    ['Lorem Ipsum', 'Lorem Ipsum'],
    ['Lorem Ipsum', 'Lorem Ipsum'],
    ['Lorem Ipsum', 'Lorem Ipsum'],
    ['Lorem Ipsum', 'Lorem Ipsum'],
  ];
  const firstSelectOptions = ['Public', 'Private'];
  const secondSelectOptions = ['10 Members', '20 Members', '3m Members'];

  const [streamSectionRadios, setStreamSectionRadios] = useState<number[]>([
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
    -1,
  ]);

  return (
    <Grommet
      theme={{
        ...theme,
        select: {},
      }}
    >
      <Form onSubmit={handleSubmit}>
        <Box direction="row" justify="between" margin={{ bottom: 'small' }}>
          <Select
            options={firstSelectOptions}
            value={firstSelect}
            onChange={({ option }) => setFirstSelect(option)}
          />
          <Select
            options={secondSelectOptions}
            value={secondSelect}
            onChange={({ option }) => setSecondSelect(option)}
          />
        </Box>
        <MeetingCheckbox
          title="Lorem Ipsum"
          width="140px"
          nopad
          onClick={() => {
            setSwtichActive(!swtichActive);
          }}
        />

        {swtichActive && (
          <SectionContainer label="Lorem Ipsum" margin={{ top: 'medium' }}>
            <Box justify="between" direction="row" wrap>
              {streamSection.map((item, i) => (
                <MeetingRadioButton
                  labels={item}
                  width="490px"
                  onClick={(index) => {
                    const temp = streamSectionRadios;
                    temp[i] = index;
                    setStreamSectionRadios(temp);
                  }}
                  nopad={i === streamSection.length - 1 && true}
                />
              ))}
            </Box>
          </SectionContainer>
        )}
      </Form>
    </Grommet>
  );
};

export default MeetingSetting;
