import React, { FC, useContext } from 'react';
import { Box, Grid, ResponsiveContext } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SectionContainer from '../../../components/utils/SectionContainer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { baseMeetingConfig } from '../../../store/static/base-meeting-config';
import Switch from '../../../components/utils/Switch';
import ExpirationTime from './components/ExpirationTime';

const MeetingConfiguration: FC = () => {
  const {
    meeting: {
      userMeetingConfig,
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);

  if (!(userMeetingConfig?.config && formPayload?.config)) return null;

  return (
    <Box gap="medium">
      <SectionContainer label={t('MeetingConfiguration.toolbarSettings')}>
        <Grid
          columns={size === 'small' ? '100%' : { count: 2, size: 'small' }}
          gap={{ column: 'large' }}
        >
          {formPayload.config.toolbarButtons &&
            baseMeetingConfig.toolbarButtons.map((toolbarBtn) => (
              <Switch
                label={t(`meetingConfig.${toolbarBtn.setting}`)}
                key={toolbarBtn.setting}
                margin={{ bottom: 'xsmall' }}
                value={formPayload.config!.toolbarButtons.includes(
                  toolbarBtn.setting
                )}
                onChange={(v) => {
                  dispatch(
                    setMeetingFormFieldAction({
                      config: {
                        ...formPayload.config,
                        toolbarButtons: v
                          ? [
                              ...formPayload.config!.toolbarButtons,
                              toolbarBtn.setting,
                            ]
                          : formPayload.config!.toolbarButtons.filter(
                              (tb: string) => tb !== toolbarBtn.setting
                            ),
                      },
                    })
                  );
                }}
              />
            ))}
        </Grid>
      </SectionContainer>
      <SectionContainer label={t('MeetingConfiguration.advanced')}>
        <Grid
          columns={size === 'small' ? '100%' : { count: 2, size: 'small' }}
          gap={{ column: 'large' }}
        >
          {/* TODO this checkbox texts comes from backend so cannot translated */}
          {formPayload?.config &&
            baseMeetingConfig.advancedButtons.map(({ setting }) => (
              <Switch
                label={t(`meetingConfig.${setting}`)}
                margin={{ bottom: 'xsmall' }}
                key={setting}
                value={!!formPayload.config?.[setting]}
                onChange={(v) => {
                  dispatch(
                    setMeetingFormFieldAction({
                      config: {
                        ...formPayload.config,
                        [setting]: v,
                      },
                    })
                  );
                }}
              />
            ))}
        </Grid>
        <ExpirationTime />
      </SectionContainer>
    </Box>
  );
};

export default MeetingConfiguration;
