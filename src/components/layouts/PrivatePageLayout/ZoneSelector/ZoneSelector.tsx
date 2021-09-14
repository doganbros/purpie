import React, { FC, useContext } from 'react';
import { Avatar, Box, DropButton, ResponsiveContext, Text } from 'grommet';
import { Add, SettingsOption, User } from 'grommet-icons';
import { useSelector } from 'react-redux';
import { navigateToSubdomain } from '../../../../helpers/app-subdomain';
import { getZoneAvatarSrc } from '../../../../pages/Private/timeline/data/zone-avatars';
import { AppState } from '../../../../store/reducers/root.reducer';
import Divider from './Divider';
import ZoneSelectorListItem from './ZoneSelectorListItem';

const ZoneSelector: FC = () => {
  const {
    zone: {
      getUserZones: { userZones },
      selectedUserZone,
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);

  return (
    <Box fill="horizontal" pad={{ horizontal: 'small' }}>
      <DropButton
        fill="horizontal"
        plain
        dropAlign={{ left: 'left', top: 'bottom' }}
        dropContent={
          <Box width={{ min: '250px' }}>
            <ZoneSelectorListItem
              selected={!selectedUserZone}
              onClick={() => {
                navigateToSubdomain();
              }}
              leftIcon={
                <Avatar background="accent-4" size="small">
                  <User size="small" />
                </Avatar>
              }
              label={`${user?.firstName} ${user?.lastName}`}
            />
            {userZones &&
              userZones.map((z) => (
                <ZoneSelectorListItem
                  selected={selectedUserZone?.id === z.id}
                  onClick={() => {
                    navigateToSubdomain(z.zone.subdomain);
                  }}
                  leftIcon={
                    <Avatar size="small" src={getZoneAvatarSrc(z.zone.id)} />
                  }
                  key={z.id}
                  label={z.zone.name}
                />
              ))}
            <Divider />
            <ZoneSelectorListItem
              label="Create Channel"
              rightIcon={<Add size="small" color="black" />}
            />
            <ZoneSelectorListItem
              label="Create Zone"
              rightIcon={<Add size="small" color="black" />}
            />
            <Divider />
            <ZoneSelectorListItem
              label="Settings"
              rightIcon={<SettingsOption size="small" color="black" />}
            />
            <Divider />
            <ZoneSelectorListItem label="Sign Out" />
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
          >
            {selectedUserZone ? (
              <Avatar
                size="medium"
                src={getZoneAvatarSrc(selectedUserZone.zone.id)}
              />
            ) : (
              <Avatar background="accent-4" size="medium">
                <User />
              </Avatar>
            )}
            <Box align="center">
              <Text weight="bold" size="xsmall" color="white">
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
