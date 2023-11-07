import React, { FC, useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  DateInput,
  FormField,
  Grid,
  ResponsiveContext,
  Select,
  Text,
  TextArea,
  TextInput,
} from 'grommet';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import TimeInput from '../../../components/utils/TimeInput';
import { ceilTime } from '../../../helpers/utils';
import { timeZones } from '../../../store/static/time-zones';
import Switch from '../../../components/utils/Switch';

const MeetingDetails: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  const size = useContext(ResponsiveContext);
  const [currentTimeZones, setCurrentTimeZones] = useState(timeZones);

  return (
    <>
      <FormField
        name="name"
        htmlFor="nameInput"
        error={
          formPayload && formPayload.title && formPayload.title.length > 64
            ? t('validators.maxLengthDefaultMsg', {
                length: 64,
              })
            : undefined
        }
      >
        <TextInput
          defaultValue={formPayload?.title}
          id="nameInput"
          name="name"
          onBlur={(e) =>
            dispatch(setMeetingFormFieldAction({ title: e.target.value }))
          }
          placeholder={t('MeetingDetails.meetingName')}
        />
      </FormField>
      <FormField
        margin={{ top: size === 'small' ? 'medium' : 'small' }}
        name="description"
        htmlFor="description"
      >
        <TextArea
          id="descriptionInput"
          defaultValue={formPayload?.description}
          onBlur={(e) =>
            dispatch(setMeetingFormFieldAction({ description: e.target.value }))
          }
          name="description"
          resize={false}
          placeholder={t('MeetingDetails.meetingDescription')}
        />
      </FormField>
      <Switch
        label={t('MeetingDetails.planForLater')}
        width={size === 'small' ? '100%' : '175px'}
        margin={{ vertical: size === 'small' ? 'large' : 'medium' }}
        defaultValue={!!formPayload?.planForLater}
        onChange={(v) => {
          dispatch(
            setMeetingFormFieldAction({
              planForLater: v,
              startDate: v ? ceilTime(new Date(), 30).toISOString() : null,
              endDate: v
                ? ceilTime(dayjs().add(2, 'hour').toDate(), 30).toISOString()
                : null,
            })
          );
        }}
      />
      {formPayload?.planForLater && (
        <Box gap={size === 'small' ? 'large' : 'small'}>
          <Grid
            columns={{ count: size === 'small' ? 1 : 2, size: 'small' }}
            gap={{ column: 'xsmall', row: 'medium' }}
          >
            <Box>
              <Text size="xsmall" color="dark-6" margin={{ bottom: 'xxsmall' }}>
                {t('MeetingDetails.startDate')}
              </Text>
              <Box direction="row" gap={size === 'small' ? 'medium' : 'xsmall'}>
                <FormField
                  name="startDate"
                  htmlFor="startDate"
                  fill="horizontal"
                >
                  <DateInput
                    format="dd/mm/yyyy"
                    value={formPayload.startDate || undefined}
                    calendarProps={{
                      bounds: [
                        new Date().toISOString(),
                        dayjs(formPayload.endDate).add(30, 'day').toISOString(),
                      ],
                    }}
                    id="startDate"
                    onChange={(e) => {
                      const startDate = new Date(
                        formPayload.startDate ||
                          dayjs(e.value as string)
                            .startOf('day')
                            .toDate()
                      );
                      const [hour, minute] = [
                        startDate.getHours(),
                        startDate.getMinutes(),
                      ];

                      return dispatch(
                        setMeetingFormFieldAction({
                          startDate: dayjs(e.value as string)
                            .startOf('day')
                            .add(hour, 'hour')
                            .add(minute, 'minute')
                            .toISOString(),
                        })
                      );
                    }}
                    name="startDate"
                    placeholder={t('MeetingDetails.setDate')}
                  />
                </FormField>
                <FormField name="time" htmlFor="timeValue" fill="horizontal">
                  <TimeInput
                    defaultValue={
                      formPayload.startDate
                        ? [
                            new Date(formPayload.startDate).getHours(),
                            new Date(formPayload.startDate).getMinutes(),
                          ]
                        : null
                    }
                    onChange={(v) => {
                      const [hour, minute] = v;
                      return dispatch(
                        setMeetingFormFieldAction({
                          startDate: dayjs(formPayload.startDate)
                            .startOf('day')
                            .add(hour, 'hours')
                            .add(minute, 'minutes')
                            .toISOString(),
                        })
                      );
                    }}
                  />
                </FormField>
              </Box>
            </Box>
            <Box>
              <Text size="xsmall" color="dark-6" margin={{ bottom: 'xxsmall' }}>
                {t('MeetingDetails.endDate')}
              </Text>
              <Box direction="row" gap={size === 'small' ? 'medium' : 'xsmall'}>
                <FormField name="endDate" htmlFor="dateValue" fill="horizontal">
                  <DateInput
                    format="dd/mm/yyyy"
                    calendarProps={{
                      bounds: [
                        formPayload.startDate || new Date().toISOString(),
                        dayjs(formPayload.endDate).add(90, 'day').toISOString(),
                      ],
                    }}
                    value={formPayload.endDate || undefined}
                    id="dateValue"
                    onChange={(e) => {
                      const endDate = new Date(
                        formPayload.endDate ||
                          dayjs(e.value as string)
                            .startOf('day')
                            .add(1, 'hour')
                            .toDate()
                      );

                      const [hour, minute] = [
                        endDate.getHours(),
                        endDate.getMinutes(),
                      ];

                      return dispatch(
                        setMeetingFormFieldAction({
                          endDate: dayjs(e.value as string)
                            .startOf('day')
                            .add(hour, 'hour')
                            .add(minute, 'minute')
                            .toISOString(),
                        })
                      );
                    }}
                    name="endDate"
                    placeholder={t('MeetingDetails.setDate')}
                  />
                </FormField>
                <FormField name="time" htmlFor="timeValue" fill="horizontal">
                  <TimeInput
                    defaultValue={
                      formPayload.endDate
                        ? [
                            new Date(formPayload.endDate).getHours(),
                            new Date(formPayload.endDate).getMinutes(),
                          ]
                        : null
                    }
                    onChange={(v) => {
                      const [hour, minute] = v;
                      return dispatch(
                        setMeetingFormFieldAction({
                          endDate: dayjs(formPayload.endDate)
                            .startOf('day')
                            .add(hour, 'hours')
                            .add(minute, 'minutes')
                            .toISOString(),
                        })
                      );
                    }}
                  />
                </FormField>
              </Box>
            </Box>
          </Grid>
          <Box>
            <Text size="xsmall" color="dark-6" margin={{ bottom: 'xxsmall' }}>
              {t('MeetingDetails.timeZone')}
            </Text>
            <Select
              options={currentTimeZones}
              defaultValue={formPayload.timeZone}
              onClose={() => setCurrentTimeZones(timeZones)}
              onSearch={(txt) =>
                setCurrentTimeZones(
                  timeZones.filter((v) => v.toLowerCase().includes(txt))
                )
              }
              onChange={({ option }) =>
                dispatch(setMeetingFormFieldAction({ timeZone: option }))
              }
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default MeetingDetails;
