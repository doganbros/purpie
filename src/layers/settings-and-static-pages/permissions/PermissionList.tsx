import React, { FC } from 'react';
import { Box, Text } from 'grommet';
import { useTranslation } from 'react-i18next';
import { PermissionActions, RoleCode } from '../types';
import PermissionCheckBox from './PermissionCheckBox';

interface PermissionListProps {
  type: string;
  permissions: PermissionActions[];
  handePermissionChange: (
    role: RoleCode,
    action: keyof PermissionActions,
    checked: boolean
  ) => void;
}

const PermissionList: FC<PermissionListProps> = ({
  permissions,
  type,
  handePermissionChange,
}) => {
  const { t } = useTranslation();

  const { roleCode, ...actions } = permissions[0];
  const roles = Object.values(RoleCode);
  return (
    <Box
      gap="small"
      elevation="peach"
      direction="column"
      justify="between"
      align="center"
      round="small"
      pad="small"
    >
      {Object.keys(actions).map((action) => (
        <Box
          key={action}
          align="center"
          direction="row"
          justify="between"
          width="full"
        >
          <Text size="small" color="dark">
            {t(`${type}PermissionAction.${action}`)}
          </Text>
          <Box direction="row" gap="132px">
            {roles.map((role) => {
              const permission = permissions.find((p) => p.roleCode === role);
              const permissionAction = action as keyof PermissionActions;
              return (
                <PermissionCheckBox
                  key={role}
                  checked={permission?.[permissionAction] as boolean}
                  handleChange={(checked) =>
                    handePermissionChange(role, permissionAction, checked)
                  }
                />
              );
            })}
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default PermissionList;
