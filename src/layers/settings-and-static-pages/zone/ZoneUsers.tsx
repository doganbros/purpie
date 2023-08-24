import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  Text,
} from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { SettingsOption } from 'grommet-icons';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelUserListItem from '../../../components/utils/channel/ChannelUserListItem';
import { SUGGESTION_AMOUNT_MORE } from '../../../helpers/constants';
import { ZoneRoleCode } from '../../../store/types/zone.types';
import { listZoneUsersAction } from '../../../store/actions/zone.action';
import ManageZoneUser from './ManageZoneUser';
import { useResponsive } from '../../../hooks/useResponsive';
import i18n from '../../../config/i18n/i18n-config';

const COLUMNS = [
  {
    property: 'userInfo',
    label: i18n.t('settings.userInfo'),
  },
  {
    property: 'email',
    label: i18n.t('settings.email'),
  },
  {
    property: 'role',
    label: i18n.t('settings.role'),
  },
  {
    property: 'createdOn',
    label: i18n.t('settings.joinDate'),
  },
  {
    property: 'action',
    label: i18n.t('settings.action'),
  },
];

interface ZoneUsersProps {
  zoneId: string;
}

const ZoneUsers: FC<ZoneUsersProps> = ({ zoneId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    zone: { zoneUsers },
  } = useSelector((state: AppState) => state);
  const size = useResponsive();

  const [manageUserInfo, setManageUserInfo] = useState<{
    role: ZoneRoleCode;
    userId: string;
  } | null>(null);

  useEffect(() => {
    getZoneUsers(0);
  }, []);

  function getZoneUsers(page: number) {
    dispatch(
      listZoneUsersAction(
        zoneId,
        SUGGESTION_AMOUNT_MORE,
        page * SUGGESTION_AMOUNT_MORE
      )
    );
  }

  const tableData = useMemo(() => {
    return zoneUsers.data.map(({ id, user, zoneRole, createdOn }) => ({
      id,
      columns: [
        <ChannelUserListItem
          key={user.id}
          id={user.id}
          userName={user.userName}
          name={user.fullName}
          displayPhoto={user.displayPhoto}
        />,
        size !== 'small' ? user.email : undefined,
        t(`Permissions.${zoneRole.roleCode}`),
        size !== 'small' ? dayjs(createdOn).format('DD/MM/YYYY') : undefined,
        <Button
          onClick={() =>
            setManageUserInfo({ userId: user.id, role: zoneRole.roleCode! })
          }
          icon={<SettingsOption size="medium" color="grayish-blue" />}
          size="small"
          key={id}
        />,
      ],
    }));
  }, [zoneUsers, size]);

  const columns =
    size !== 'small'
      ? COLUMNS
      : COLUMNS.filter(
          (c) => c.property !== 'email' && c.property !== 'createdOn'
        );
  return (
    <>
      <Box gap="medium">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((c, idx) => (
                <TableCell
                  key={c.property}
                  margin={{ vertical: 'xxsmall', horizontal: 'small' }}
                  scope="col"
                  border={{ side: 'bottom', color: 'status-disabled-light' }}
                  align={idx === 0 ? 'left' : 'center'}
                >
                  <Text color="status-disabled" size="small" weight={500}>
                    {c.label}
                  </Text>
                </TableCell>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableData.map((data) => (
              <TableRow key={data.id}>
                {COLUMNS.map(
                  (c, idx) =>
                    data.columns[idx] !== undefined && (
                      <TableCell
                        key={c.property}
                        margin={{
                          vertical: 'xxsmall',
                          horizontal: size === 'small' ? '0' : 'small',
                        }}
                        align={idx === 0 ? 'left' : 'center'}
                      >
                        {typeof data.columns[idx] === 'string' ? (
                          <Text size="small" color="status-disabled">
                            {data.columns[idx]}
                          </Text>
                        ) : (
                          data.columns[idx]
                        )}
                      </TableCell>
                    )
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {zoneUsers.skip / zoneUsers.limit !== 0 && (
          <Pagination
            size="small"
            alignSelf="end"
            numberItems={zoneUsers.total}
            page={zoneUsers.skip / zoneUsers.limit + 1}
            step={SUGGESTION_AMOUNT_MORE}
            onChange={({ page }) => getZoneUsers(page - 1)}
          />
        )}
      </Box>
      {manageUserInfo && (
        <ManageZoneUser
          zoneId={zoneId}
          userId={manageUserInfo.userId}
          defaultRoleCode={manageUserInfo.role}
          onDismiss={() => setManageUserInfo(null)}
        />
      )}
    </>
  );
};

export default ZoneUsers;
