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
  inviteZoneAction,
  getUserZoneByIdAction,
} from '../../store/actions/zone.action';
import { InviteZonePayload } from '../../store/types/zone.types';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { AppState } from '../../store/reducers/root.reducer';

interface Props {
  visible: boolean;
  onClose: () => void;
  zoneId?: number;
  subdomain?: string;
}

const InviteZone: FC<Props> = ({ visible, onClose, zoneId }) => {
  const dispatch = useDispatch();

  const {
    createZone: { loading },
    updateZone: { loading: updateLoading },
  } = useSelector((state: AppState) => state.zone);

  useEffect(() => {
    if (zoneId) {
      dispatch(getUserZoneByIdAction(zoneId));
    }
  }, [zoneId, visible]);

  const handleSubmit: FormSubmitEvent<InviteZonePayload> = ({ value }) => {
    dispatch(inviteZoneAction(zoneId, value.email));
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
            Invite Person to Zone
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

export default InviteZone;
