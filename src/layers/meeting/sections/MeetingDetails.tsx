import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, TextInput, TextArea, DateInput, FormField } from 'grommet';
import dayjs from 'dayjs';
import { validators } from '../../../helpers/validators';
import MeetingCheckbox from '../components/MeetingCheckbox';
import { AppState } from '../../../store/reducers/root.reducer';
import { setMeetingFormFieldAction } from '../../../store/actions/meeting.action';
import TimeInput from '../../../components/utils/TimeInput';
import { ceilTime } from '../../../helpers/utils';

const MeetingDetails: FC = () => {
  const dispatch = useDispatch();

  const {
    meeting: {
      createMeeting: {
        form: { payload: formPayload },
      },
    },
  } = useSelector((state: AppState) => state);

  return (
    <>
      <FormField name="name" htmlFor="nameInput">
        <TextInput
          defaultValue={formPayload?.title}
          id="nameInput"
          name="name"
          onBlur={(e) =>
            dispatch(setMeetingFormFieldAction({ title: e.target.value }))
          }
          placeholder="Meeting Name"
        />
      </FormField>
      <FormField name="description" htmlFor="description">
        <TextArea
          id="descriptionInput"
          defaultValue={formPayload?.description}
          onBlur={(e) =>
            dispatch(setMeetingFormFieldAction({ description: e.target.value }))
          }
          name="description"
          resize={false}
          placeholder="Meeting Description"
        />
      </FormField>
      <MeetingCheckbox
        title="Plan for later"
        width="140px"
        nopad
        value={!!formPayload?.planForLater}
        onChange={(v) => {
          dispatch(
            setMeetingFormFieldAction({
              planForLater: v,
              startDate: v ? ceilTime(new Date(), 30).toISOString() : null,
            })
          );
        }}
      />
      {formPayload?.planForLater && (
        <Box
          direction="row"
          gap="small"
          align="center"
          margin={{ top: 'small' }}
        >
          <FormField
            validate={validators.required()}
            name="date"
            htmlFor="dateValue"
            fill="horizontal"
          >
            <DateInput
              format="dd/mm/yyyy"
              value={formPayload.startDate || undefined}
              id="dateValue"
              onChange={(e) => {
                if (!formPayload.startDate)
                  return dispatch(
                    setMeetingFormFieldAction({
                      startDate: dayjs(e.value as string)
                        .startOf('day')
                        .toISOString(),
                    })
                  );
                const startDate = new Date(formPayload.startDate);
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
              name="date"
              placeholder="Set Date"
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
                if (!formPayload.startDate)
                  return dispatch(
                    setMeetingFormFieldAction({
                      startDate: dayjs()
                        .add(3, 'days')
                        .startOf('day')
                        .add(hour, 'hours')
                        .add(minute, 'minutes')
                        .toISOString(),
                    })
                  );

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
      )}
    </>
  );
};

export default MeetingDetails;
