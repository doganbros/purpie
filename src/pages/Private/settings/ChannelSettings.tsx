import React, { useState } from 'react';
import { Box, CheckBox, Grid, Text, TextInput } from 'grommet';
import { useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import SectionContainer from '../../../components/utils/SectionContainer';
import { ChannelSettingsData } from './types';

interface ChannelSettingsProps {
  onSave: () => void;
  channelPayload: any;
  onChange: any;
}

const ChannelSettings: (props: ChannelSettingsProps) => ChannelSettingsData = ({
  onSave,
  channelPayload,
  onChange,
}) => {
  const {
    channel: { userChannels },
  } = useSelector((state: AppState) => state);

  const [channelPermissions, setChannelPermissions] = useState<any>({
    canInvite: userChannels.data[0].channelRole.canInvite,
    canDelete: userChannels.data[0].channelRole.canDelete,
    canEdit: userChannels.data[0].channelRole.canEdit,
    canManageRole: userChannels.data[0].channelRole.canManageRole,
  });
  return {
    id: 1,
    key: 'channel',
    label: 'Channel Settings',
    url: 'channel',
    name: '',
    members: '203',
    whichZone: 'in Car Zone',
    onSave,
    items: [
      {
        key: 'name1',
        title: 'Channel Name',
        description: 'Change channel name',
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
              value={channelPayload.name}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...channelPayload,
                  name: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'Topic',
        title: 'Channel Topic',
        description: 'Change channel topic',
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
              value={channelPayload.topic}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...channelPayload,
                  topic: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'channelTitle',
        title: 'Channel Description',
        description: 'Change channel description',
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
              value={channelPayload.description}
              plain
              focusIndicator={false}
              onChange={(event) =>
                onChange({
                  ...channelPayload,
                  description: event.target.value,
                })
              }
            />
          </Box>
        ),
      },

      {
        key: 'usersPermissions',
        title: 'Permissions',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="User Permissions">
            <Grid
              rows={['xxsmall', 'xxsmall']}
              columns={['medium', 'medium']}
              gap="small"
            >
              <Box
                align="center"
                justify="between"
                direction="row"
                gap="xsmall"
              >
                <Text>Can edit</Text>
                <CheckBox
                  checked={channelPermissions.canEdit}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canEdit: !channelPermissions.canEdit,
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
                  checked={channelPermissions.canDelete}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canDelete: !channelPermissions.canDelete,
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
                  checked={channelPermissions.canInvite}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canInvite: !channelPermissions.canInvite,
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
                <Text>Can manage role</Text>
                <CheckBox
                  checked={channelPermissions.canManageRole}
                  onChange={() =>
                    setChannelPermissions({
                      ...channelPermissions,
                      canManageRole: !channelPermissions.canManageRole,
                    })
                  }
                />
              </Box>
            </Grid>
          </SectionContainer>
        ),
      },

      {
        key: 'channelPublic',
        title: '',
        description: '',
        value: 'value',
        component: (
          <SectionContainer label="Channel Visibility">
            <Grid rows={['xxsmall']} columns={['medium', 'medium']} gap="small">
              <Box direction="row" justify="between" gap="xsmall">
                <Text>Public</Text>
                <CheckBox
                  checked={channelPayload.public}
                  onChange={() =>
                    onChange({
                      ...channelPayload,
                      public: !channelPayload.public,
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

export default ChannelSettings;
