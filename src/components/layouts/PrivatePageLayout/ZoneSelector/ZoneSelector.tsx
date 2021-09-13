import React, { FC, useContext } from 'react';
import { Avatar, Box, DropButton, ResponsiveContext, Text } from 'grommet';
import { Add, SettingsOption, User } from 'grommet-icons';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../store/reducers/root.reducer';
import Divider from './Divider';
import ZoneSelectorListItem from './ZoneSelectorListItem';
import { zoneAvatarSrc } from '../../../../pages/Private/timeline/data/zone-avatars';

const ZoneSelector: FC = () => {
  const {
    zone: {
      getUserZones: { userZones },
    },
    auth: { user },
  } = useSelector((state: AppState) => state);
  const size = useContext(ResponsiveContext);

  return (
    <DropButton
      plain
      dropAlign={{ left: 'left', top: 'bottom' }}
      dropContent={
        <Box width={{ min: '250px' }}>
          <ZoneSelectorListItem
            selected
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
                leftIcon={
                  <Avatar
                    size="small"
                    src={zoneAvatarSrc[z.zone.id % zoneAvatarSrc.length]}
                  />
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
      }}
    >
      <Box
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
        <Avatar background="accent-4" size="medium">
          <User />
        </Avatar>
        <Box align="center">
          <Text weight="bold" size="xsmall" color="white">
            {user?.firstName} {user?.lastName}
          </Text>
          <Text size="xsmall">Zone</Text>
        </Box>
      </Box>
    </DropButton>
  );
};

export default ZoneSelector;
