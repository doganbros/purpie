import React, { FC, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextInput,
  TextArea,
  DateInput,
  FormField,
  Select,
  Layer,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Close } from 'grommet-icons';
import { CreateMeetingPayload } from '../../store/types/meeting.types';
import {
  createMeetingAction,
  getMeetingByIdAction,
  updateMeetingByIdAction,
} from '../../store/actions/meeting.action';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { getMultipleTenantsAction } from '../../store/actions/tenant.action';
import { AppState } from '../../store/reducers/root.reducer';
import { Tenant } from '../../store/types/tenant.types';

interface Payload extends CreateMeetingPayload {
  tenant: Tenant;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  meetingId?: number;
  tenantId?: number;
}

const CreateUpdateMeeting: FC<Props> = ({
  onClose,
  visible,
  meetingId,
  tenantId,
}) => {
  const dispatch = useDispatch();
  const {
    tenant: {
      getMultipleTenants: { tenants },
    },
    meeting: {
      createMeeting: { loading },
      updateMeetingById: { loading: updateLoading },
      getOneMeeting: { loading: meetingLoading, meeting },
    },
  } = useSelector((state: AppState) => state);

  useEffect(() => {
    dispatch(getMultipleTenantsAction());

    if (meetingId && tenantId) {
      dispatch(getMeetingByIdAction(tenantId, meetingId));
    }
  }, [meetingId, tenantId]);

  const defaultDate = useRef(new Date().toISOString());

  const handleSubmit: FormSubmitEvent<Payload> = ({ value }) => {
    const payload = {
      ...value,
      startDate: value.startDate || defaultDate.current,
      endDate: value.endDate || defaultDate.current,
      tenantId: value.tenant?.id,
    };
    if (meetingId) {
      dispatch(updateMeetingByIdAction(meetingId, payload));
    } else {
      dispatch(createMeetingAction(payload));
    }
  };

  if (!visible) return null;
  return (
    <Layer
      position="right"
      full="vertical"
      modal
      onClickOutside={onClose}
      onEsc={onClose}
    >
      <Box
        overflow="auto"
        background="light-2"
        fill="vertical"
        width="medium"
        pad="medium"
        gap="small"
      >
        <Box flex={false} direction="row" justify="between">
          <Heading level={2} margin="none">
            {meetingId ? 'Update' : 'Create'} Meeting
          </Heading>
          <Button icon={<Close />} onClick={onClose} />
        </Box>

        {!meetingId || !meetingLoading ? (
          <Form onSubmit={handleSubmit}>
            {!meetingId && (
              <FormField
                label="Select Tenant"
                name="tenant"
                htmlFor="tenantIdInput"
                validate={meetingId ? validators.required() : undefined}
              >
                <Select
                  options={tenants || []}
                  labelKey="name"
                  defaultValue={meetingId && meeting?.tenantId}
                  valueKey="id"
                  name="tenant"
                />
              </FormField>
            )}
            <FormField
              label="Meeting Title"
              name="title"
              htmlFor="titleInput"
              validate={!meetingId ? validators.required() : undefined}
            >
              <TextInput
                id="titleInput"
                defaultValue={meetingId && meeting?.title}
                name="title"
              />
            </FormField>
            <FormField
              label="Meeting Description"
              name="description"
              htmlFor="description"
              validate={!meetingId ? validators.required() : undefined}
            >
              <TextArea
                id="descriptionInput"
                defaultValue={meetingId && meeting?.description}
                name="description"
              />
            </FormField>
            <FormField
              name="startDate"
              htmlFor="startDateInput"
              label="Start Date"
            >
              <DateInput
                format="dd/mm/yyyy"
                defaultValue={
                  (meetingId && meeting?.startDate) || defaultDate.current
                }
                id="startDateInput"
                name="startDate"
              />
            </FormField>
            <FormField name="endDate" htmlFor="endDateInput" label="End Date">
              <DateInput
                format="dd/mm/yyyy"
                defaultValue={
                  (meetingId && meeting?.startDate) || defaultDate.current
                }
                id="endDateInput"
                name="endDate"
              />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button
                hoverIndicator="background"
                primary
                disabled={loading || updateLoading}
                type="submit"
                label="Go!"
              />
            </Box>
          </Form>
        ) : null}
      </Box>
    </Layer>
  );
};

export default CreateUpdateMeeting;
