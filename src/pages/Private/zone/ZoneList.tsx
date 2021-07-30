import React, { FC, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardFooter,
  CardBody,
  Heading,
  TextInput,
  Text,
} from 'grommet';
import { CloudComputer, Edit, Info, Search, Task, Trash } from 'grommet-icons';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeUpdateZoneLayerAction,
  deleteUserZoneAction,
  openUpdateZoneLayerAction,
  openInvitePersonLayerAction,
  closeInvitePersonLayerAction,
} from '../../../store/actions/zone.action';
import PrivatePageLayout from '../../../components/layouts/PrivatePageLayout/PrivatePageLayout';
import { AppState } from '../../../store/reducers/root.reducer';
import { UserZone } from '../../../store/types/zone.types';
import CreateUpdateZone from '../../../layers/zone/CreateUpdateZone';
import InviteZone from '../../../layers/zone/InviteZone';

const ZoneList: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const [tenantUpdating, setZoneUpdating] = useState<number | null>(null);
  const [invitePerson, setInvitePerson] = useState<{
    zoneId: number;
    subdomain: string;
  } | null>(null);

  const {
    getMultipleUserZones: { userZones, loading },
    updateZone: { layerIsVisible },
    invitePersonZone: { layerInviteIsVisible },
  } = useSelector((state: AppState) => state.zone);

  const deleteUserZone = (userZone: UserZone) =>
    dispatch(deleteUserZoneAction(userZone.id));

  const onClose = () => {
    dispatch(closeUpdateZoneLayerAction);
    setZoneUpdating(null);
  };

  const onCloseInvite = () => {
    dispatch(closeInvitePersonLayerAction);
    setInvitePerson(null);
  };

  const onOpen = (id: number) => {
    setZoneUpdating(id);
    dispatch(openUpdateZoneLayerAction);
  };

  const onInvitePerson = (subdomain: string, zoneId: number) => {
    setInvitePerson({ subdomain, zoneId });
    dispatch(openInvitePersonLayerAction);
  };

  return (
    <PrivatePageLayout
      title="Zones"
      icon={CloudComputer}
      topComponent={<Heading level="3">Zones</Heading>}
      rightComponent={
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
      <CreateUpdateZone
        zoneId={tenantUpdating || undefined}
        visible={!!tenantUpdating && layerIsVisible}
        onClose={onClose}
      />
      <InviteZone
        zoneId={invitePerson?.zoneId}
        subdomain={invitePerson?.subdomain}
        visible={
          !!invitePerson?.subdomain &&
          !!invitePerson?.zoneId &&
          layerInviteIsVisible
        }
        onClose={onCloseInvite}
      />
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        userZones?.map((userZone) => (
          <Card
            flex={false}
            width={{ max: '1000px' }}
            margin={{ bottom: 'medium' }}
            background={{ light: 'light-1', dark: 'dark-1' }}
            key={userZone.zone.id}
          >
            <CardHeader pad="medium">{userZone.zone.name}</CardHeader>
            <CardBody pad="medium">{userZone.zone.description}</CardBody>
            <CardFooter
              pad={{ horizontal: 'small' }}
              background={{ light: 'light-2', dark: 'dark-2' }}
            >
              <Button
                onClick={() => history.push(`/meetings/${userZone.zone.id}`)}
                icon={<Task />}
                hoverIndicator
              />
              <Button
                onClick={() =>
                  onInvitePerson(userZone.zone.subdomain, userZone.zone.id)
                }
                icon={<Edit />}
                hoverIndicator
              />
              <Button
                onClick={() => onOpen(userZone.id)}
                icon={<Edit />}
                hoverIndicator
              />
              <Button
                icon={<Trash />}
                hoverIndicator
                onClick={() => deleteUserZone(userZone)}
              />
            </CardFooter>
          </Card>
        ))
      )}

      {userZones?.length === 0 ? <Text>No Zone Available</Text> : null}
    </PrivatePageLayout>
  );
};

export default ZoneList;
