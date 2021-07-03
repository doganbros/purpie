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
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { CreateMeetingPayload } from '../../../store/types/meeting.types';
import { createMeetingAction } from '../../../store/actions/meeting.action';
import { validators } from '../../../helpers/validators';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { getMultipleTenantsAction } from '../../../store/actions/tenant.action';
import { AppState } from '../../../store/reducers/root.reducer';
import { Tenant } from '../../../store/types/tenant.types';

interface Payload extends CreateMeetingPayload {
  tenant: Tenant;
}

const CreateMeeting: FC = () => {
  const dispatch = useDispatch();

  const {
    getMultipleTenants: { tenants },
    createTenant: { loading },
  } = useSelector((state: AppState) => state.tenant);

  useEffect(() => {
    dispatch(getMultipleTenantsAction());
  }, []);
  const defaultDate = useRef(new Date().toISOString());

  const handleSubmit: FormSubmitEvent<Payload> = ({ value }) => {
    const payload = {
      ...value,
      startDate: value.startDate || defaultDate.current,
      endDate: value.endDate || defaultDate.current,
      tenantId: value.tenant?.id,
    };
    dispatch(createMeetingAction(payload));
  };

  return (
    <PrivatePageLayout title="Create Meeting">
      <Box fill align="center" justify="center" margin="large">
        <Box>
          <Box pad="small">
            <Heading margin="none">Create Meeting</Heading>
          </Box>

          <Form onSubmit={handleSubmit}>
            <FormField
              label="Select Tenant"
              name="tenant"
              htmlFor="tenantIdInput"
              validate={validators.required()}
            >
              <Select
                options={tenants || []}
                labelKey="name"
                valueKey="id"
                name="tenant"
              />
            </FormField>
            <FormField
              label="Meeting Title"
              name="title"
              htmlFor="titleInput"
              validate={validators.required()}
            >
              <TextInput id="nameInput" name="title" />
            </FormField>
            <FormField
              label="Meeting Description"
              name="description"
              htmlFor="description"
              validate={validators.required()}
            >
              <TextArea id="descriptionInput" name="description" />
            </FormField>
            <FormField
              name="startDate"
              htmlFor="startDateInput"
              label="Start Date"
            >
              <DateInput
                format="dd/mm/yyyy"
                defaultValue={defaultDate.current}
                id="startDateInput"
                name="startDate"
              />
            </FormField>
            <FormField name="endDate" htmlFor="endDateInput" label="End Date">
              <DateInput
                format="dd/mm/yyyy"
                defaultValue={defaultDate.current}
                id="endDateInput"
                name="endDate"
              />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button primary disabled={loading} type="submit" label="Go!" />
            </Box>
          </Form>
        </Box>
      </Box>
    </PrivatePageLayout>
  );
};

export default CreateMeeting;
