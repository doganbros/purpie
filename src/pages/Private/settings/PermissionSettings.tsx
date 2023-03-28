import React, { useState } from 'react';
import { Box } from 'grommet';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';
import RoleHeader from '../../../layers/settings-and-static-pages/permissions/RoleHeader';
import PermissionList from '../../../layers/settings-and-static-pages/permissions/PermissionList';
import {
  PermissionActions,
  RoleCode,
} from '../../../layers/settings-and-static-pages/types';

const PermissionSettings: () => Menu = () => {
  // TODO - this data fetch from backend API
  const [channelPermissions, setChannelPermissions] = useState<
    PermissionActions[]
  >([
    {
      roleCode: RoleCode.OWNER,
      canInvite: true,
      canDelete: true,
      canEdit: true,
      canManageRole: true,
    },
    {
      roleCode: RoleCode.MODERATOR,
      canInvite: true,
      canDelete: false,
      canEdit: true,
      canManageRole: false,
    },
    {
      roleCode: RoleCode.USER,
      canInvite: true,
      canDelete: false,
      canEdit: false,
      canManageRole: false,
    },
  ]);
  const [zonePermissions, setZonePermissions] = useState<PermissionActions[]>([
    {
      roleCode: RoleCode.OWNER,
      canCreateChannel: true,
      canInvite: true,
      canDelete: true,
      canEdit: true,
      canManageRole: true,
    },
    {
      roleCode: RoleCode.MODERATOR,
      canCreateChannel: true,
      canInvite: true,
      canDelete: false,
      canEdit: true,
      canManageRole: false,
    },
    {
      roleCode: RoleCode.USER,
      canCreateChannel: false,
      canInvite: true,
      canDelete: false,
      canEdit: false,
      canManageRole: false,
    },
  ]);

  const handeChannelPermissionChange = (
    role: RoleCode,
    action: keyof PermissionActions,
    checked: boolean
  ) => {
    const tempPermissions: PermissionActions[] = [...channelPermissions];
    const permissionIndex = tempPermissions.findIndex(
      (p) => p.roleCode === role
    );
    if (permissionIndex !== -1) {
      tempPermissions[permissionIndex][action] = checked;
      setChannelPermissions(tempPermissions);
    }
  };

  const handeZonePermissionChange = (
    role: RoleCode,
    action: keyof PermissionActions,
    checked: boolean
  ) => {
    const tempPermissions: PermissionActions[] = [...zonePermissions];
    const permissionIndex = tempPermissions.findIndex(
      (p) => p.roleCode === role
    );
    if (permissionIndex !== -1) {
      tempPermissions[permissionIndex][action] = checked;
      setZonePermissions(tempPermissions);
    }
  };

  return {
    id: 1,
    key: 'permissionSettings',
    label: 'Permissions',
    url: 'permissions',
    items: [
      {
        key: 'channelManagement',
        title: 'Channel Management',
        value: 'value',
        component: (
          <Box>
            <RoleHeader />
            <PermissionList
              type="Channel"
              permissions={channelPermissions}
              handePermissionChange={handeChannelPermissionChange}
            />
          </Box>
        ),
      },
      {
        key: 'zoneManagement',
        title: 'Zone Management',
        value: 'value',
        component: (
          <Box>
            <RoleHeader />
            <PermissionList
              type="Zone"
              permissions={zonePermissions}
              handePermissionChange={handeZonePermissionChange}
            />
          </Box>
        ),
      },
    ],
  };
};

export default PermissionSettings;
