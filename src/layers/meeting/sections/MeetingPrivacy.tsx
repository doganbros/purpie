import React, { FC, useContext } from 'react';
import { Box, FormField, Grid, ResponsiveContext, Select } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import SectionContainer from '../../../components/utils/SectionContainer';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import { validators } from '../../../helpers/validators';
import Switch from '../../../components/utils/Switch';

const MeetingPrivacy: FC = () => {
  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
    zone: { selectedUserZone },
    channel: { userChannels, selectedChannel },
  } = useSelector((state: AppState) => state);

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);

  return (
    <>
      {!selectedChannel && (
        <>
          <SectionContainer label={t('MeetingPrivacy.joining')}>
            {!selectedUserZone ? (
              <Grid
                columns={
                  size === 'small' ? 'full' : { count: 2, size: 'small' }
                }
                gap={{ column: 'xlarge', row: 'small' }}
              >
                <Switch
                  label={t('MeetingPrivacy.publicMeeting')}
                  fill="vertical"
                  value={!!formPayload?.public}
                  onChange={(v) => {
                    dispatch(
                      setMeetingFormFieldAction({
                        public: v,
                        channelId: null,
                      })
                    );
                  }}
                />
              </Grid>
            ) : (
              <Box justify="between" align="center" direction="row">
                <FormField
                  label={t('MeetingPrivacy.selectChannel')}
                  name="channelId"
                  validate={validators.required(
                    t('MeetingPrivacy.selectChannel')
                  )}
                >
                  <Select
                    name="channelId"
                    placeholder={t('common.choose')}
                    options={userChannels.data
                      .filter(
                        (c) => c.channel.zoneId === selectedUserZone?.zone.id
                      )
                      .map(({ channel: { id, name } }) => ({
                        id,
                        name,
                      }))}
                    labelKey="name"
                    valueKey={{ key: 'id', reduce: true }}
                    onChange={({ option }) => {
                      dispatch(
                        setMeetingFormFieldAction({
                          channelId: option.id,
                        })
                      );
                    }}
                  />
                </FormField>
              </Box>
            )}
          </SectionContainer>
          <Box height="20px" />
        </>
      )}
      <SectionContainer label={t('MeetingPrivacy.streamingRecording')}>
        <Grid
          columns={size === 'small' ? 'full' : { count: 2, size: 'small' }}
          gap={{ column: 'xlarge', row: 'small' }}
        >
          <Switch
            label={t('MeetingPrivacy.liveStreamOrMeeting')}
            fill="vertical"
            value={!!formPayload?.liveStream}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  liveStream: v,
                  record: false,
                })
              );
            }}
          />
          <Switch
            label={t('MeetingPrivacy.enableRecording')}
            fill="vertical"
            value={!!formPayload?.record}
            onChange={(v) => {
              dispatch(
                setMeetingFormFieldAction({
                  liveStream: false,
                  record: v,
                })
              );
            }}
          />
        </Grid>
      </SectionContainer>
    </>
  );
};

export default MeetingPrivacy;
