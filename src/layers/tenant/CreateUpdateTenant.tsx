import React, { FC, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextInput,
  FormField,
  TextArea,
  Layer,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  createTenantAction,
  getTenantByIdAction,
  updateTenantAction,
} from '../../store/actions/tenant.action';
import {
  CreateTenantPayload,
  UpdateTenantPayload,
} from '../../store/types/tenant.types';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { AppState } from '../../store/reducers/root.reducer';

interface Props {
  visible: boolean;
  onClose: () => void;
  tenantId?: number;
}

const CreateUpdateTenant: FC<Props> = ({ visible, onClose, tenantId }) => {
  const dispatch = useDispatch();

  const {
    createTenant: { loading },
    updateTenant: { loading: updateLoading },
    getOneTenant: { loading: tenantLoading, tenant },
  } = useSelector((state: AppState) => state.tenant);

  useEffect(() => {
    if (tenantId) {
      dispatch(getTenantByIdAction(tenantId));
    }
  }, [tenantId, visible]);

  const handleSubmit: FormSubmitEvent<CreateTenantPayload> = ({ value }) => {
    if (tenantId) {
      const updateValue: UpdateTenantPayload = {
        name: value.name || tenant?.name,
        description: value.description || tenant?.description,
        website: value.website || tenant?.website,
      };

      dispatch(updateTenantAction(updateValue, tenantId));
      return;
    }

    dispatch(createTenantAction(value));
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
        width="medium"
        pad="medium"
        gap="small"
        fill="vertical"
      >
        <Box flex={false} direction="row" justify="between">
          <Heading level={2} margin="none">
            {tenantId ? 'Update' : 'Create'} Tenant
          </Heading>
          <Button icon={<Close />} onClick={onClose} />
        </Box>

        <Box>
          {!tenantId || !tenantLoading ? (
            <Form onSubmit={handleSubmit}>
              <FormField
                label="Name"
                htmlFor="nameInput"
                name="name"
                validate={!tenantId ? [validators.required()] : undefined}
              >
                <TextInput
                  defaultValue={tenantId && tenant?.name}
                  id="nameInput"
                  name="name"
                />
              </FormField>
              <FormField
                label="Description"
                name="description"
                htmlFor="descriptionInput"
              >
                <TextArea
                  id="descriptionInput"
                  defaultValue={tenantId && tenant?.description}
                  name="description"
                />
              </FormField>
              <FormField label="Website" name="website" htmlFor="websiteInput">
                <TextInput
                  id="websiteInput"
                  defaultValue={tenantId && tenant?.website}
                  name="website"
                />
              </FormField>
              <Box pad={{ vertical: 'medium' }} align="end">
                <Button
                  disabled={loading || updateLoading}
                  type="submit"
                  label="Go!"
                />
              </Box>
            </Form>
          ) : null}
        </Box>
      </Box>
    </Layer>
  );
};

export default CreateUpdateTenant;
