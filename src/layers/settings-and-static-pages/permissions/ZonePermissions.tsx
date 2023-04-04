import React, { FC, useEffect } from 'react';
import { Box, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import RoleHeader from './RoleHeader';
import {
  UserZoneListItem,
  ZoneRole,
  ZoneRoleCode,
} from '../../../store/types/zone.types';
import {
  getZoneRolesAction,
  updateZonePermissionsAction,
} from '../../../store/actions/zone.action';
import PermissionCheckBox from './PermissionCheckBox';

interface ZonePermissionsProps {
  userZone: UserZoneListItem;
}

const ZonePermissions: FC<ZonePermissionsProps> = ({ userZone }) => {
  const { t } = useTranslation();
  const {
    zone: { zoneRoles },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getZoneRolesAction(userZone.zone.id));
  }, [userZone]);

  const handeZonePermissionChange = (
    role: ZoneRoleCode,
    action: keyof ZoneRole,
    checked: boolean
  ) => {
    const params: ZoneRole = {
      roleCode: role,
      [action]: checked,
    };
    dispatch(updateZonePermissionsAction(userZone.zone.id, params));
  };

  if (zoneRoles.data.length > 0) {
    const { roleCode, id, zoneId, ...actions } = zoneRoles.data[0];
    const roleCodes = Object.values(ZoneRoleCode);
    return (
      <Box>
        <Box
          direction="row"
          align="center"
          justify="between"
          pad={{ bottom: 'small' }}
        >
          <Text size="medium" weight="bold">
            Permissions
          </Text>
          <RoleHeader />
        </Box>

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
                {t(`ZonePermissionAction.${action}`)}
              </Text>
              <Box direction="row" gap="132px">
                {roleCodes.map((role) => {
                  const permission = zoneRoles.data.find(
                    (p) => p.roleCode === role
                  );
                  const permissionAction = action as keyof ZoneRole;
                  return (
                    <PermissionCheckBox
                      key={role}
                      disabled={role === ZoneRoleCode.OWNER}
                      checked={permission?.[permissionAction] as boolean}
                      handleChange={(checked) =>
                        handeZonePermissionChange(
                          role,
                          permissionAction,
                          checked
                        )
                      }
                    />
                  );
                })}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    );
  }
  return null;
};

export default ZonePermissions;
