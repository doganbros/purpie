import React, { FC, useContext, useState } from 'react';
import { Box, DropButton, ResponsiveContext, Text } from 'grommet';
import { Add, SettingsOption } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';
import { AppState } from '../../../../store/reducers/root.reducer';
import Divider from './Divider';
import ZoneSelectorListItem from './ZoneSelectorListItem';
import { openCreateZoneLayerAction } from '../../../../store/actions/zone.action';
import { openCreateChannelLayerAction } from '../../../../store/actions/channel.action';
import { logoutAction } from '../../../../store/actions/auth.action';
import InitialsAvatar from '../../../utils/InitialsAvatar';

const ZoneSelector: FC = () => {
  const {
    zone: {
      getUserZones: { userZones },
      selectedUserZone,
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <Box fill="horizontal" pad={{ horizontal: 'small' }}>
      <DropButton
        onMouseEnter={() => {
          setHover(true);
        }}
        onMouseLeave={() => {
          setHover(false);
        }}
        fill="horizontal"
        plain
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        dropAlign={{ left: 'left', top: 'bottom' }}
        dropContent={
          <Box width={{ min: '250px' }}>
            <ZoneSelectorListItem
              selected={!selectedUserZone}
              onClick={() => {
                navigateToSubdomain();
              }}
              leftIcon={
                user && (
                  <InitialsAvatar
                    id={user.id}
                    value={`${user.firstName} ${user.lastName}`}
                  />
                )
              }
              label={`${user?.firstName} ${user?.lastName}`}
            />
            {userZones &&
              userZones.map((z) => (
                <ZoneSelectorListItem
                  selected={selectedUserZone?.zone.id === z.zone.id}
                  onClick={() => {
                    navigateToSubdomain(z.zone.subdomain);
                  }}
                  leftIcon={
                    <InitialsAvatar id={z.zone.id} value={z.zone.name} />
                  }
                  key={z.zone.id}
                  label={z.zone.name}
                />
              ))}
            <Divider />
            <ZoneSelectorListItem
              onClick={() => {
                setOpen(false);
                dispatch(openCreateChannelLayerAction());
              }}
              label="Create Channel"
              rightIcon={<Add size="small" color="black" />}
            />
            <ZoneSelectorListItem
              onClick={() => {
                setOpen(false);
                dispatch(openCreateZoneLayerAction());
              }}
              label="Create Zone"
              rightIcon={<Add size="small" color="black" />}
            />
            <Divider />
            <ZoneSelectorListItem
              label="Settings"
              rightIcon={<SettingsOption size="small" color="black" />}
            />
            <Divider />
            <ZoneSelectorListItem
              onClick={() => dispatch(logoutAction())}
              label="Sign Out"
            />
          </Box>
        }
        dropProps={{
          margin: { vertical: 'small' },
          elevation: 'medium',
          round: 'small',
        }}
      >
        <Box fill="horizontal">
          <Box
            fill="horizontal"
            align="center"
            justify="around"
            background="brand"
            gap="small"
            pad={{
              horizontal: 'small',
              vertical: size === 'small' ? 'medium' : 'small',
            }}
            round="medium"
            elevation={hover ? 'indigo' : 'none'}
          >
            {selectedUserZone ? (
              <InitialsAvatar
                id={selectedUserZone.zone.id}
                value={selectedUserZone.zone.name}
              />
            ) : (
              user && (
                <InitialsAvatar
                  id={user.id}
                  value={`${user.firstName} ${user.lastName}`}
                />
              )
            )}
            <Box align="center">
              <Text
                textAlign="center"
                weight="bold"
                size="xsmall"
                color="white"
              >
                {selectedUserZone
                  ? selectedUserZone.zone.name
                  : `${user?.firstName} ${user?.lastName}`}
              </Text>
            </Box>
          </Box>
        </Box>
      </DropButton>
    </Box>
  );
};

export default ZoneSelector;
