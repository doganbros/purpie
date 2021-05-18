import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  TextInput,
  Text,
} from 'grommet';
import { CloudComputer, Edit, Info, Search, Task, Trash } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeUpdateTenantLayerAction,
  deleteTenantAction,
  openUpdateTenantLayerAction,
  openInvitePersonLayerAction,
  closeInvitePersonLayerAction,
} from '../../../store/actions/tenant.action';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import { Tenant } from '../../../store/types/tenant.types';
import CreateUpdateTenant from '../../../layers/tenant/CreateUpdateTenant';
import InviteTenant from '../../../layers/tenant/InviteTenant';

const TenantList: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [tenantUpdating, setTenantUpdating] = useState<number | null>(null);
  const [invitePerson, setInvitePerson] = useState<{
    tenantId: number;
    subdomain: string;
  } | null>(null);

  const {
    getMultipleTenants: { tenants, loading },
    updateTenant: { layerIsVisible },
    invitePersonTenant: { layerInviteIsVisible },
  } = useSelector((state: AppState) => state.tenant);

  const deleteTenant = (tenant: Tenant) =>
    dispatch(deleteTenantAction(tenant.id));

  const onClose = () => {
    dispatch(closeUpdateTenantLayerAction);
    setTenantUpdating(null);
  };

  const onCloseInvite = () => {
    dispatch(closeInvitePersonLayerAction);
    setInvitePerson(null);
  };

  const onOpen = (id: number) => {
    setTenantUpdating(id);
    dispatch(openUpdateTenantLayerAction);
  };

  const onInvitePerson = (subdomain: string, tenantId: number) => {
    setInvitePerson({ subdomain, tenantId });
    dispatch(openInvitePersonLayerAction);
  };

  return (
    <PrivatePageLayout
      title="Tenants"
      icon={CloudComputer}
      rightSideItem={
        <Box flex={{ grow: 2 }}>
          <Box
            pad={{ horizontal: 'medium' }}
            style={{ position: 'fixed' }}
            height="100%"
            overflow="auto"
          >
            <Box fill="horizontal" margin={{ vertical: 'medium' }} gap="medium">
              <TextInput icon={<Search />} placeholder="Search..." />
            </Box>
            <Card background="brand">
              <CardBody pad="small">
                <Box gap="small" align="center" pad="small">
                  <Info size="large" />
                  <Box>
                    <Text>
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                      Corporis, quam.
                    </Text>
                  </Box>
                </Box>
              </CardBody>
              <CardFooter pad={{ horizontal: 'medium', vertical: 'small' }}>
                <Text size="xsmall">12 components</Text>
              </CardFooter>
            </Card>
          </Box>
        </Box>
      }
    >
      <CreateUpdateTenant
        tenantId={tenantUpdating || undefined}
        visible={!!tenantUpdating && layerIsVisible}
        onClose={onClose}
      />
      <InviteTenant
        tenantId={invitePerson?.tenantId}
        subdomain={invitePerson?.subdomain}
        visible={
          !!invitePerson?.subdomain &&
          !!invitePerson?.tenantId &&
          layerInviteIsVisible
        }
        onClose={onCloseInvite}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        tenants?.map((tenant) => (
          <Card
            flex={false}
            width={{ max: '1000px' }}
            margin={{ bottom: 'medium' }}
            background={{ light: 'light-1', dark: 'dark-1' }}
            key={tenant.id}
          >
            <CardHeader pad="medium">{tenant.name}</CardHeader>
            <CardBody pad="medium">{tenant.description}</CardBody>
            <CardFooter
              pad={{ horizontal: 'small' }}
              background={{ light: 'light-2', dark: 'dark-2' }}
            >
              <Button
                onClick={() => history.push(`/meetings/${tenant.id}`)}
                icon={<Task />}
                hoverIndicator
              />
              <Button
                onClick={() => onInvitePerson(tenant.subdomain, tenant.id)}
                icon={<Edit />}
                hoverIndicator
              />
              <Button
                onClick={() => onOpen(tenant.id)}
                icon={<Edit />}
                hoverIndicator
              />
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => deleteTenant(tenant)}
              />
            </CardFooter>
          </Card>
        ))
      )}

      {tenants?.length === 0 ? <Text>No Tenant Available</Text> : null}
    </PrivatePageLayout>
  );
};

export default TenantList;
