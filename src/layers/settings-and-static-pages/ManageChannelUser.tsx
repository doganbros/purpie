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
import {
  ChannelRoleCode,
  ManageChannelPayload,
} from '../../store/types/channel.types';
import { updateUserChannelRoleAction } from '../../store/actions/channel.action';
import ConfirmDialog from '../../components/utils/ConfirmDialog';

interface ManageChannelUserProps {
  onDismiss: () => void;
  defaultRoleCode: ChannelRoleCode;
  channelId: string;
  userId: string;
}

const ManageChannelUser: FC<ManageChannelUserProps> = ({
  onDismiss,
  defaultRoleCode,
  channelId,
  userId,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const size = useContext(ResponsiveContext);
  const [
    newChannelRoleCode,
    setNewChannelRoleCode,
  ] = useState<ChannelRoleCode | null>(null);

  function updateChannelRole() {
    onDismiss();

    if (newChannelRoleCode)
      dispatch(
        updateUserChannelRoleAction(channelId, {
          userId,
          channelRoleCode: newChannelRoleCode,
        })
      );
  }

  const roleCodes = Object.values(ChannelRoleCode);
  return (
    <Layer onClickOutside={onDismiss}>
      {newChannelRoleCode ? (
        <ConfirmDialog
          message={t('ManageChannelUser.saveChannelChangesConfirm')}
          onConfirm={() => {
            updateChannelRole();
          }}
          onDismiss={() => setNewChannelRoleCode(null)}
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
              {t('ManageChannelUser.title')}
            </Text>
            <Button plain onClick={onDismiss}>
              <Close color="brand-alt" />
            </Button>
          </Box>
          <Form
            onSubmit={({ value }: FormExtendedEvent<ManageChannelPayload>) => {
              setNewChannelRoleCode(value.roleCode as ChannelRoleCode);
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

export default ManageChannelUser;
