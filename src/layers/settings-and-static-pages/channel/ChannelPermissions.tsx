import React, { FC, useContext, useEffect, useState } from 'react';
import { Box, ResponsiveContext, Text } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';

import { useTranslation } from 'react-i18next';
import { nanoid } from 'nanoid';
import {
  getChannelRolesAction,
  updateChannelPermissionsAction,
} from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  ChannelRoleCode,
  UserChannelListItem,
  UserChannelPermissionList,
} from '../../../store/types/channel.types';
import RoleHeader from '../permissions/RoleHeader';
import PermissionCheckBox from '../permissions/PermissionCheckBox';
import '../permissions/Style.scss';

interface ChannelPermissionsProps {
  userChannel: UserChannelListItem;
  searchText?: string;
}

const ChannelPermissions: FC<ChannelPermissionsProps> = ({
  userChannel,
  searchText,
}) => {
  const { t } = useTranslation();
  const size = useContext(ResponsiveContext);

  const {
    channel: { channelRoles },
  } = useSelector((state: AppState) => state);

  const dispatch = useDispatch();

  const [channelPermissions, setChannelPermissions] = useState<
    UserChannelPermissionList[]
  >([]);

  useEffect(() => {
    dispatch(getChannelRolesAction(userChannel.channel.id));
  }, [userChannel]);

  useEffect(() => {
    setChannelPermissions(
      channelRoles.data.map((role) => ({
        roleCode: role.roleCode,
        canInvite: role.canInvite,
        canDelete: role.canDelete,
        canEdit: role.canEdit,
        canManageRole: role.canManageRole,
      }))
    );
  }, [channelRoles]);

  const handeChannelPermissionChange = (
    role: ChannelRoleCode,
    action: keyof UserChannelPermissionList,
    checked: boolean
  ) => {
    const params: UserChannelPermissionList = {
      roleCode: role,
      [action]: checked,
    };
    dispatch(updateChannelPermissionsAction(userChannel.channel.id, params));
  };

  if (channelPermissions.length > 0) {
    const { roleCode, ...actions } = channelPermissions[0];
    const roleCodes = Object.values(ChannelRoleCode);
    return (
      <Box gap="xsmall" className="z-index--1">
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
            const labelParts = t(`ChannelPermissionAction.${action}`)
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
                      {labelParts.map(({ part, id }) =>
                        part.toLowerCase() !== searchText!.toLowerCase() ? (
                          `${part}`
                        ) : (
                          <Text size="small" key={id} weight="bold">
                            {part}
                          </Text>
                        )
                      )}
                    </Text>
                  </Box>
                )}
                <Box direction="row" gap={size === 'small' ? '16px' : '72px'}>
                  {roleCodes.map((role) => {
                    const permission = channelPermissions.find(
                      (p) => p.roleCode === role
                    );
                    const permissionAction = action as keyof UserChannelPermissionList;
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
                          disabled={role === ChannelRoleCode.OWNER}
                          checked={permission?.[permissionAction] as boolean}
                          handleChange={(checked) =>
                            handeChannelPermissionChange(
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

export default ChannelPermissions;
