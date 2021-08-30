import React, { FC } from 'react';
import { Box } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import SectionContainer from '../../../components/utils/SectionContainer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { baseMeetingConfig } from '../../../store/static/base-meeting-config';
import Switch from '../../../components/utils/Switch';

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

  if (!(userMeetingConfig?.config && formPayload?.config)) return null;

  return (
    <SectionContainer label="Toolbars">
      <Box wrap justify="between" direction="row" overflow="auto">
        {formPayload.config.toolbarButtons &&
          baseMeetingConfig.toolbarButtons.map((toolbarBtn: string) => (
            <Switch
              label={toolbarBtn}
              key={toolbarBtn}
              margin={{ bottom: 'xsmall' }}
              width="30%"
              value={formPayload.config!.toolbarButtons.includes(toolbarBtn)}
              onChange={(v) => {
                dispatch(
                  setMeetingFormFieldAction({
                    config: {
                      ...formPayload.config,
                      toolbarButtons: v
                        ? [...formPayload.config!.toolbarButtons, toolbarBtn]
                        : formPayload.config!.toolbarButtons.filter(
                            (t: string) => t !== toolbarBtn
                          ),
                    },
                  })
                );
              }}
            />
          ))}
      </Box>
    </SectionContainer>
  );
};

export default MeetingSetting;
