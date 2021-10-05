import React, { FC, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, ResponsiveContext } from 'grommet';
import SectionContainer from '../../../components/utils/SectionContainer';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { camelToSentence } from '../../../helpers/utils';
import Switch from '../../../components/utils/Switch';

const MeetingMoreSetting: FC = () => {
  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const size = useContext(ResponsiveContext);

  return (
    <>
      <SectionContainer>
        <Grid
          columns={size === 'small' ? '100%' : { count: 2, size: 'small' }}
          gap={{ column: 'large' }}
        >
          {formPayload?.config &&
            Object.keys(formPayload.config).map((setting) => {
              if (typeof formPayload.config![setting] === 'boolean')
                return (
                  <Switch
                    label={camelToSentence(setting)}
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
                );
              return null;
            })}
        </Grid>
      </SectionContainer>
    </>
  );
};

export default MeetingMoreSetting;
