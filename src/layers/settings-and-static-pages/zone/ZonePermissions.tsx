import React, { FC, useContext, useEffect } from 'react';
import { Box, ResponsiveContext, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import { AppState } from '../../../store/reducers/root.reducer';
import RoleHeader from '../permissions/RoleHeader';
import {
  UserZoneListItem,
  ZoneRole,
  ZoneRoleCode,
} from '../../../store/types/zone.types';
import {
  getZoneRolesAction,
  updateZonePermissionsAction,
} from '../../../store/actions/zone.action';
import PermissionCheckBox from '../permissions/PermissionCheckBox';

interface ZonePermissionsProps {
  userZone: UserZoneListItem;
  searchText?: string;
}

const ZonePermissions: FC<ZonePermissionsProps> = ({
  userZone,
  searchText,
}) => {
  const { t } = useTranslation();
  const {
    zone: { zoneRoles },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);

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
      <Box gap="xsmall">
        {size !== 'small' && <RoleHeader />}

        <Box
          gap={size === 'small' ? 'medium' : 'small'}
          direction="column"
          justify="between"
          align="center"
          round="small"
          pad="small"
          border={{ size: '1px', color: 'status-disabled-light' }}
        >
          {Object.keys(actions).map((action) => {
            const labelParts = t(`ZonePermissionAction.${action}`)
              .split(new RegExp(`(${searchText})`, 'gi'))
              .map((p) => ({ part: p, id: nanoid() }));

            return (
              <Box
                key={action}
                align={size === 'small' ? 'start' : 'center'}
                direction={size === 'small' ? 'column' : 'row'}
                justify={size === 'small' ? 'center' : 'between'}
                width="full"
                gap="small"
              >
                {labelParts.length > 0 && (
                  <Box direction="column">
                    <Text size="small" weight={400} color="dark">
                      {labelParts.map((label) =>
                        label.part.toLowerCase() !==
                        searchText!.toLowerCase() ? (
                          `${label.part}`
                        ) : (
                          <Text size="small" key={label.id} weight="bold">
                            {label.part}
                          </Text>
                        )
                      )}
                    </Text>
                  </Box>
                )}
                <Box direction="row" gap={size === 'small' ? '16px' : '72px'}>
                  {roleCodes.map((role) => {
                    const permission = zoneRoles.data.find(
                      (p) => p.roleCode === role
                    );
                    const permissionAction = action as keyof ZoneRole;
                    return (
                      <>
                        {size === 'small' && (
                          <Text
                            size="small"
                            color="light-turquoise"
                            margin={{ right: 'small' }}
                          >
                            {t(`Permissions.${role}`)}
                          </Text>
                        )}
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
                      </>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    );
  }
  return null;
};

export default ZonePermissions;
