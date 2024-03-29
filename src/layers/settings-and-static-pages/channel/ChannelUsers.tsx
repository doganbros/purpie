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
import { listChannelUsersAction } from '../../../store/actions/channel.action';
import { AppState } from '../../../store/reducers/root.reducer';
import ChannelUserListItem from '../../../components/utils/channel/ChannelUserListItem';
import { ChannelRoleCode } from '../../../store/types/channel.types';
import ManageChannelUser from './ManageChannelUser';
import { SUGGESTION_AMOUNT_MORE } from '../../../helpers/constants';
import { useResponsive } from '../../../hooks/useResponsive';
import i18n from '../../../config/i18n/i18n-config';

const COLUMNS = [
  {
    property: 'userInfo',
    label: '',
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
    label: i18n.t('settings.followingDate'),
  },
  {
    property: 'action',
    label: i18n.t('settings.action'),
  },
];

interface ChannelUsersProps {
  channelId: string;
}

const ChannelUsers: FC<ChannelUsersProps> = ({ channelId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    channel: { channelUsers },
  } = useSelector((state: AppState) => state);
  const size = useResponsive();

  const [manageUserInfo, setManageUserInfo] = useState<{
    role: ChannelRoleCode;
    userId: string;
  } | null>(null);

  useEffect(() => {
    getChannelUsers(0);
  }, []);

  function getChannelUsers(page: number) {
    dispatch(
      listChannelUsersAction(
        channelId,
        SUGGESTION_AMOUNT_MORE,
        page * SUGGESTION_AMOUNT_MORE
      )
    );
  }

  const tableData = useMemo(() => {
    return channelUsers.data.map(({ id, user, channelRole, createdOn }) => ({
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
        t(`Permissions.${channelRole.roleCode}`),
        size !== 'small' ? dayjs(createdOn).format('DD/MM/YYYY') : undefined,
        <Button
          onClick={() =>
            setManageUserInfo({ userId: user.id, role: channelRole.roleCode })
          }
          icon={<SettingsOption size="20px" color="status-disabled" />}
          size="small"
          key={id}
        />,
      ],
    }));
  }, [channelUsers, size]);

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
                  <Text color="dark" weight={400} size="small">
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
                          <Text
                            size="small"
                            color="status-disabled"
                            weight={400}
                          >
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
        {channelUsers.skip / channelUsers.limit !== 0 && (
          <Pagination
            size="small"
            alignSelf="end"
            numberItems={channelUsers.total}
            page={channelUsers.skip / channelUsers.limit + 1}
            step={SUGGESTION_AMOUNT_MORE}
            onChange={({ page }) => getChannelUsers(page - 1)}
          />
        )}
      </Box>
      {manageUserInfo && (
        <ManageChannelUser
          channelId={channelId}
          userId={manageUserInfo.userId}
          defaultRoleCode={manageUserInfo.role}
          onDismiss={() => setManageUserInfo(null)}
        />
      )}
    </>
  );
};

export default ChannelUsers;
