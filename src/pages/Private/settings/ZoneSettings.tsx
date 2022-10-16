import { Box, CheckBox, Grid, Text, TextInput } from 'grommet';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import SectionContainer from '../../../components/utils/SectionContainer';
import { AppState } from '../../../store/reducers/root.reducer';
import { ZoneSettingsData } from './types';

interface ZoneSettingsProps {
  onSave: () => void;
  zonePayload: any;
  onChange: any;
}

const ZoneSettings: (props: ZoneSettingsProps) => ZoneSettingsData = ({
  onSave,
  zonePayload,
  onChange,
}) => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);

  const [zonePermissions, setZonePermissions] = useState<any>({
    canInvite: userZones?.[0].zoneRole.canInvite,
    canDelete: userZones?.[0].zoneRole.canDelete,
    canEdit: userZones?.[0].zoneRole.canEdit,
    canManageRole: userZones?.[0].zoneRole.canManageRole,
    canCreateChannel: userZones?.[0].zoneRole.canDelete,
  });
  return {
    id: 2,
    key: 'zone',
    label: 'Zone Settings',
    url: 'zone',
    name: 'Car Zone',
    members: '23 Zone',
    onSave,
    items: [
      {
        key: 'zoneName',
        title: 'Zone Name',
        description: 'Change zone name',
        value: 'value',
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            pad="xxsmall"
          >
            <TextInput
              value={zonePayload.name}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...zonePayload,
                  name: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'zoneTitle',
        title: 'Zone Subdomain',
        description: 'Change zone subdomain',
        value: 'value',
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            pad="xxsmall"
          >
            <TextInput
              value={zonePayload.subdomain}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...zonePayload,
                  subdomain: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'zoneDescription',
        title: 'Zone Description',
        description: 'Change zone description',
        value: 'value',
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            gap="small"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            pad="xxsmall"
          >
            <TextInput
              value={zonePayload.description}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...zonePayload,
                  description: event.target.value,
                })
              }
            />
          </Box>
        ),
      },

      {
        key: 'zoneManageRole',
        title: 'Permissions',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="User Permissions">
            <Grid
              rows={['xxsmall', 'xxsmall', 'xxsmall']}
              columns={['medium', 'medium']}
              gap="small"
            >
              <Box
                align="center"
                direction="row"
                gap="xsmall"
                justify="between"
              >
                <Text>Can manage roles</Text>
                <CheckBox
                  checked={zonePermissions.canManageRole}
                  onChange={() =>
                    setZonePermissions({
                      ...zonePermissions,
                      canManageRole: !zonePermissions.canManageRole,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can edit</Text>
                <CheckBox
                  checked={zonePermissions.canEdit}
                  onChange={() =>
                    setZonePermissions({
                      ...zonePermissions,
                      canEdit: !zonePermissions.canEdit,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can delete</Text>
                <CheckBox
                  checked={zonePermissions.canDelete}
                  onChange={() =>
                    setZonePermissions({
                      ...zonePermissions,
                      canDelete: !zonePermissions.canDelete,
                    })
                  }
                />
              </Box>

              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can invite</Text>
                <CheckBox
                  checked={zonePermissions.canInvite}
                  onChange={() =>
                    setZonePermissions({
                      ...zonePermissions,
                      canInvite: !zonePermissions.canInvite,
                    })
                  }
                />
              </Box>
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can create channels</Text>
                <CheckBox
                  checked={zonePermissions.canCreateChannel}
                  onChange={() =>
                    setZonePermissions({
                      ...zonePermissions,
                      canCreateChannel: !zonePermissions.canCreateChannel,
                    })
                  }
                />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
      {
        key: 'zonePublic',
        title: '',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="Zone Visibility">
            <Grid rows={['xxsmall']} columns={['medium', 'medium']} gap="small">
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Public</Text>
                <CheckBox
                  checked={zonePayload.public}
                  onChange={() =>
                    onChange({
                      ...zonePayload,
                      public: !zonePayload.public,
                    })
                  }
                />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },
    ],
  };
};

export default ZoneSettings;
