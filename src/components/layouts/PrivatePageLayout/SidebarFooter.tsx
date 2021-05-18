import { Box, Menu, Text } from 'grommet';
import { AddCircle, CloudComputer, Group, Logout, User } from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CreateUpdateMeeting from '../../../layers/meeting/CreateUpdateMeeting';
import CreateUpdateTenant from '../../../layers/tenant/CreateUpdateTenant';
import { logoutAction } from '../../../store/actions/auth.action';
import {
  closeCreateMeetingLayerAction,
  openCreateMeetingLayerAction,
} from '../../../store/actions/meeting.action';
import {
  closeCreateTenantLayerAction,
  openCreateTenantLayerAction,
} from '../../../store/actions/tenant.action';
import { AppState } from '../../../store/reducers/root.reducer';

const SidebarFooter: FC = () => {
  const dispatch = useDispatch();

  const {
    tenant: {
      createTenant: { layerIsVisible: createTenantVisible },
    },
    meeting: {
      createMeeting: { layerIsVisible: createMeetingVisible },
    },
  } = useSelector((state: AppState) => state);

  const data = [
    {
      label: (
        <Box pad={{ left: 'xsmall' }}>
          <Text size="large">Meeting</Text>
        </Box>
      ),
      state: 'Meeting',
      onClick: () => dispatch(openCreateMeetingLayerAction),
      icon: <Group size="medium" />,
    },
    {
      label: (
        <Box pad={{ horizontal: 'xsmall' }}>
          <Text size="large">Tenant</Text>
        </Box>
      ),
      onClick: () => dispatch(openCreateTenantLayerAction),
      state: 'Tenant',
      icon: <CloudComputer size="medium" />,
    },
  ];

  const logout = () => dispatch(logoutAction);
  return (
    <>
      <CreateUpdateTenant
        visible={createTenantVisible}
        onClose={() => dispatch(closeCreateTenantLayerAction)}
      />
      <CreateUpdateMeeting
        visible={createMeetingVisible}
        onClose={() => dispatch(closeCreateMeetingLayerAction)}
      />
      <Menu
        margin={{ bottom: '10px' }}
        alignSelf="center"
        items={data}
        icon={<AddCircle />}
      />
      <Menu
        alignSelf="center"
        items={[
          {
            label: <Box pad={{ left: 'xsmall' }}>Logout</Box>,
            onClick: logout,
            icon: <Logout />,
          },
        ]}
        icon={<User />}
      />
    </>
  );
};

export default SidebarFooter;
