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
import { listChannelUsersAction } from '../../store/actions/channel.action';
import { AppState } from '../../store/reducers/root.reducer';
import ChannelUserListItem from '../../components/utils/channel/ChannelUserListItem';
import { ChannelRoleCode } from '../../store/types/channel.types';
import ManageChannelUser from './ManageChannelUser';
import { SUGGESTION_AMOUNT_MORE } from '../../helpers/constants';

const COLUMNS = [
  {
    property: 'userInfo',
    label: 'User Info',
  },
  {
    property: 'email',
    label: 'Email',
  },
  {
    property: 'role',
    label: 'Role',
  },
  {
    property: 'createdOn',
    label: 'Following Date',
  },
  {
    property: 'action',
    label: 'Action',
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
        user.email,
        t(`Permissions.${channelRole.roleCode}`),
        dayjs(createdOn).format('DD/MM/YYYY'),
        <Button
          onClick={() =>
            setManageUserInfo({ userId: user.id, role: channelRole.roleCode })
          }
          primary
          size="small"
          key={id}
          label="Manage"
        />,
      ],
    }));
  }, [channelUsers]);

  return (
    <>
      <Box gap="medium">
        <Table>
          <TableHeader>
            <TableRow>
              {COLUMNS.map((c, idx) => (
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
                {COLUMNS.map((c, idx) => (
                  <TableCell
                    key={c.property}
                    margin={{ vertical: 'xxsmall', horizontal: 'small' }}
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
                ))}
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
