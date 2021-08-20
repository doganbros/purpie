import React, { FC } from 'react';
import { Box, Select, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import SectionContainer from '../../../components/utils/SectionContainer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { baseMeetingConfig } from '../../../store/static/base-meeting-config';

const MeetingSetting: FC = () => {
  const {
    meeting: {
      userMeetingConfig,
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  return (
    <>
      {userMeetingConfig?.config && formPayload?.config && (
        <SectionContainer label="Toolbars">
          <Select
            margin={{ bottom: 'small' }}
            options={baseMeetingConfig.toolbarButtons}
            multiple
            messages={{
              multiple: `${formPayload.config.toolbarButtons.length} selected`,
            }}
            value={formPayload.config.toolbarButtons}
            placeholder="Choose"
            closeOnChange={false}
            onChange={({ value }) => {
              dispatch(
                setMeetingFormFieldAction({
                  config: {
                    ...formPayload.config,
                    toolbarButtons: value,
                  },
                })
              );
            }}
          />
          <Box wrap justify="between" direction="row" overflow="auto">
            {formPayload.config &&
              Array.isArray(formPayload.config.toolbarButtons) &&
              formPayload.config.toolbarButtons.map((toolbarBtn: string) => (
                <Box
                  pad={{ bottom: 'xsmall' }}
                  direction="row"
                  key={toolbarBtn}
                  gap="medium"
                  width="150px"
                  justify="between"
                >
                  <Text size="small">{toolbarBtn}</Text>
                </Box>
              ))}
          </Box>
        </SectionContainer>
      )}
    </>
  );
};

export default MeetingSetting;
