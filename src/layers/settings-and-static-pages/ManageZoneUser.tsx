import React, { FC, useContext, useState } from 'react';
import {
  Box,
  Button,
  Form,
  FormExtendedEvent,
  FormField,
  Layer,
  ResponsiveContext,
  Select,
  Text,
} from 'grommet';
import { Close } from 'grommet-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import { ZoneRoleCode } from '../../store/types/zone.types';
import { updateUserZoneRoleAction } from '../../store/actions/zone.action';
import ConfirmDialog from '../../components/utils/ConfirmDialog';
import { ManageChannelPayload } from '../../store/types/channel.types';

interface ManageZoneUserProps {
  onDismiss: () => void;
  defaultRoleCode: ZoneRoleCode;
  zoneId: string;
  userId: string;
}

const ManageZoneUser: FC<ManageZoneUserProps> = ({
  onDismiss,
  defaultRoleCode,
  zoneId,
  userId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);
  const [newZoneRoleCode, setNewZoneRoleCode] = useState<ZoneRoleCode | null>(
    null
  );

  function updateZoneRole() {
    onDismiss();

    if (newZoneRoleCode)
      dispatch(
        updateUserZoneRoleAction(zoneId, {
          userId,
          zoneRoleCode: newZoneRoleCode,
        })
      );
  }

  const roleCodes = Object.values(ZoneRoleCode);
  return (
    <Layer onClickOutside={onDismiss}>
      {newZoneRoleCode ? (
        <ConfirmDialog
          message={t('ManageZoneUser.saveChannelChangesConfirm')}
          onConfirm={() => {
            updateZoneRole();
          }}
          onDismiss={() => setNewZoneRoleCode(null)}
          textProps={{ wordBreak: 'break-word' }}
        />
      ) : (
        <Box
          width={size !== 'small' ? '520px' : undefined}
          round={size !== 'small' ? '20px' : undefined}
          fill={size === 'small'}
          background="white"
          pad="medium"
          gap="medium"
        >
          <Box direction="row" justify="between" align="start">
            <Text size="large" weight="bold">
              {t('ManageZoneUser.title')}
            </Text>
            <Button plain onClick={onDismiss}>
              <Close color="brand-alt" />
            </Button>
          </Box>
          <Form
            onSubmit={({ value }: FormExtendedEvent<ManageChannelPayload>) => {
              setNewZoneRoleCode(value.roleCode as ZoneRoleCode);
            }}
          >
            <Box height={{ min: 'min-content' }}>
              <FormField name="roleCode">
                <Select
                  defaultValue={defaultRoleCode}
                  name="roleCode"
                  options={
                    roleCodes.map((role) => ({
                      role,
                    })) || []
                  }
                  labelKey={({ role }) => t(`Permissions.${role}`)}
                  valueKey={{ key: 'role', reduce: true }}
                />
              </FormField>
            </Box>

            <Button
              type="submit"
              primary
              label={t('common.save')}
              size="large"
              fill="horizontal"
              margin={{ top: 'medium' }}
            />
          </Form>
        </Box>
      )}
    </Layer>
  );
};

export default ManageZoneUser;
