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
  createZoneAction,
  getUserZoneByIdAction,
  updateZoneAction,
} from '../../store/actions/zone.action';
import {
  CreateZonePayload,
  UpdateZonePayload,
} from '../../store/types/zone.types';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { AppState } from '../../store/reducers/root.reducer';

interface Props {
  visible: boolean;
  onClose: () => void;
  zoneId?: number;
}

const CreateUpdateZone: FC<Props> = ({ visible, onClose, zoneId }) => {
  const dispatch = useDispatch();

  const {
    createZone: { loading },
    updateZone: { loading: updateLoading },
    getOneZone: { loading: tenantLoading, userZone },
  } = useSelector((state: AppState) => state.zone);

  useEffect(() => {
    if (zoneId) {
      dispatch(getUserZoneByIdAction(zoneId));
    }
  }, [zoneId, visible]);

  const handleSubmit: FormSubmitEvent<CreateZonePayload> = ({ value }) => {
    if (zoneId) {
      const updateValue: UpdateZonePayload = {
        name: value.name || userZone?.zone.name,
        description: value.description || userZone?.zone.description,
        subdomain: value.subdomain || userZone?.zone.subdomain,
      };

      dispatch(updateZoneAction(updateValue, zoneId));
      return;
    }

    dispatch(createZoneAction(value));
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
            {zoneId ? 'Update' : 'Create'} Zone
          </Heading>
          <Button icon={<Close />} onClick={onClose} />
        </Box>

        <Box>
          {!zoneId || !tenantLoading ? (
            <Form onSubmit={handleSubmit}>
              <FormField
                label="Name"
                htmlFor="nameInput"
                name="name"
                validate={!zoneId ? [validators.required()] : undefined}
              >
                <TextInput
                  defaultValue={zoneId && userZone?.zone.name}
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
                  defaultValue={zoneId && userZone?.zone.description}
                  name="description"
                />
              </FormField>
              <FormField
                label="Subdomain"
                name="subdomain"
                htmlFor="subdomainInput"
                validate={
                  !zoneId
                    ? [
                        validators.required(),
                        validators.matches(
                          /([a-z.])+([a-z])$/g,
                          'Please provide a valid subdomain'
                        ),
                      ]
                    : undefined
                }
              >
                <TextInput
                  id="subdomainInput"
                  defaultValue={zoneId && userZone?.zone.subdomain}
                  name="subdomain"
                />
              </FormField>
              <Box pad={{ vertical: 'medium' }} align="end">
                <Button
                  disabled={loading || updateLoading}
                  primary
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

export default CreateUpdateZone;
