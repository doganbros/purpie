import React, { FC, useContext, useState } from 'react';
import { Avatar, Box, DropButton, ResponsiveContext, Text } from 'grommet';
import { Add, SettingsOption } from 'grommet-icons';
import { nanoid } from 'nanoid';
import Divider from './Divider';
import ZoneSelectorListItem from './ZoneSelectorListItem';

const ZoneSelector: FC = () => {
  const zones = [
    { id: nanoid(), name: 'Interaction Design Master' },
    { id: nanoid(), name: 'Course' },
    { id: nanoid(), name: 'Doganbros' },
    { id: nanoid(), name: 'Company' },
  ];
  const [value] = useState('Doganbros');
  const size = useContext(ResponsiveContext);

  return (
    <DropButton
      plain
      dropAlign={{ left: 'left', top: 'bottom' }}
      dropContent={
        <Box width={{ min: '250px' }}>
          {zones.map((z) => (
            <ZoneSelectorListItem
              leftIcon={<Avatar size="small" background="light-6" />}
              selected={z.name === value}
              key={z.id}
              label={z.name}
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
        <Avatar background="light-1" size="medium" />
        <Box align="center">
          <Text weight="bold" size="xsmall" color="white">
            {value}
          </Text>
          <Text size="xsmall">Zone</Text>
        </Box>
      </Box>
    </DropButton>
  );
};

export default ZoneSelector;
