import React, { FC, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Form,
  TextInput,
  FormField,
  Layer,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  inviteTenantAction,
  getTenantByIdAction,
} from '../../store/actions/tenant.action';
import { InviteTenantPayload } from '../../store/types/tenant.types';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { AppState } from '../../store/reducers/root.reducer';

interface Props {
  visible: boolean;
  onClose: () => void;
  tenantId?: number;
  subdomain?: string;
}

const InviteTenant: FC<Props> = ({ visible, onClose, tenantId }) => {
  const dispatch = useDispatch();

  const {
    createTenant: { loading },
    updateTenant: { loading: updateLoading },
  } = useSelector((state: AppState) => state.tenant);

  useEffect(() => {
    if (tenantId) {
      dispatch(getTenantByIdAction(tenantId));
    }
  }, [tenantId, visible]);

  const handleSubmit: FormSubmitEvent<InviteTenantPayload> = ({ value }) => {
    dispatch(inviteTenantAction(tenantId, value.email));
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
            Invite Person to Tenant
          </Heading>
          <Button icon={<Close />} onClick={onClose} />
        </Box>

        <Box>
          <Form onSubmit={handleSubmit}>
            <FormField
              label="Email"
              htmlFor="nameInput"
              name="email"
              validate={[validators.required()]}
            >
              <TextInput id="nameInput" name="email" />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button
                disabled={loading || updateLoading}
                type="submit"
                label="Go!"
              />
            </Box>
          </Form>
        </Box>
      </Box>
    </Layer>
  );
};

export default InviteTenant;
