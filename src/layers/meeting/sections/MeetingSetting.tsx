import React, { FC, useContext } from 'react';
import { Grid, ResponsiveContext } from 'grommet';
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
  const size = useContext(ResponsiveContext);

  if (!(userMeetingConfig?.config && formPayload?.config)) return null;

  return (
    <SectionContainer label="Toolbars">
      <Grid
        columns={size === 'small' ? '100%' : { count: 2, size: 'small' }}
        gap={{ column: 'large' }}
      >
        {formPayload.config.toolbarButtons &&
          baseMeetingConfig.toolbarButtons.map((toolbarBtn: string) => (
            <Switch
              label={toolbarBtn}
              key={toolbarBtn}
              margin={{ bottom: 'xsmall' }}
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
      </Grid>
    </SectionContainer>
  );
};

export default MeetingSetting;
