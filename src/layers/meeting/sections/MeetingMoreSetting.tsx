import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from 'grommet';
import SectionContainer from '../../../components/utils/SectionContainer';
import MeetingCheckbox from '../components/MeetingCheckbox';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { camelToSentence } from '../../../helpers/utils';

const MeetingMoreSetting: FC = () => {
  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  return (
    <>
      <SectionContainer label="">
        <Box justify="between" direction="row" overflow="auto" wrap>
          {formPayload?.config &&
            Object.keys(formPayload.config).map((setting) => {
              if (typeof formPayload.config![setting] === 'boolean')
                return (
                  <MeetingCheckbox
                    title={camelToSentence(setting)}
                    width="280px"
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
        </Box>
      </SectionContainer>
    </>
  );
};

export default MeetingMoreSetting;
