import React, { useState } from 'react';
import { Box, CheckBox, DropButton, Grid, Text, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import ListButton from '../../../components/utils/ListButton';
import SectionContainer from '../../../components/utils/SectionContainer';
import {
  REACT_APP_API_VERSION,
  REACT_APP_SERVER_HOST,
} from '../../../config/http';
import { AppState } from '../../../store/reducers/root.reducer';
import { UpdateZonePayload } from '../../../store/types/zone.types';
import { AvatarItem } from './AvatarItem';
import { SettingsData } from './types';
import {
  changeZoneInformationAction,
  changeZonePhoto,
} from '../../../store/actions/zone.action';
import AvatarUpload from './AvatarUpload';

const ZoneSettings: () => SettingsData | null = () => {
  const {
    zone: {
      getUserZones: { userZones },
    },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [selectedUserZoneIndex, setSelectedUserZoneIndex] = useState(0);
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const [zonePayload, setZonePayload] = useState<UpdateZonePayload>({
    name: userZones?.[0].zone.name || '',
    description: userZones?.[0].zone.description || '',
    subdomain: userZones?.[0].zone.subdomain || '',
    id: userZones?.[0].zone.id || 0,
    public: userZones?.[0].zone.public || false,
  });
  const [zonePermissions, setZonePermissions] = useState({
    canInvite: userZones?.[0].zoneRole.canInvite,
    canDelete: userZones?.[0].zoneRole.canDelete,
    canEdit: userZones?.[0].zoneRole.canEdit,
    canManageRole: userZones?.[0].zoneRole.canManageRole,
    canCreateChannel: userZones?.[0].zoneRole.canDelete,
  });
  if (!userZones) return null;
  const zoneId = userZones[selectedUserZoneIndex].zone.id;
  return {
    id: 2,
    key: 'zone',
    label: 'Zone Settings',
    url: 'zone',
    onSave: () => {
      if (!(zoneId === null || zoneId === undefined)) {
        dispatch(changeZoneInformationAction(zoneId, zonePayload));
      }
    },
    avatarWidget: (
      <>
        <DropButton
          dropProps={{
            responsive: false,
            stretch: false,
            overflow: { vertical: 'scroll' },
          }}
          dropContent={
            <Box>
              {userZones.map((item, index) => (
                <ListButton
                  label={item.zone.name}
                  key={item.zone.id}
                  onClick={() => {
                    setZonePayload({
                      name: item.zone.name,
                      id: item.zone.id,
                      subdomain: item.zone.subdomain,
                      public: item.zone.public,
                      description: item.zone.description,
                    });
                    setSelectedUserZoneIndex(index);
                  }}
                />
              ))}
            </Box>
          }
        >
          <AvatarItem
            title={userZones[selectedUserZoneIndex].zone.name}
            subtitle={userZones[selectedUserZoneIndex].zone.subdomain}
            src={`${REACT_APP_SERVER_HOST}/${REACT_APP_API_VERSION}/zone/display-photo/${userZones[selectedUserZoneIndex].zone.displayPhoto}`}
            onClickEdit={() => setShowAvatarUpload(true)}
          />
        </DropButton>
        {showAvatarUpload && !(zoneId === null) && (
          <AvatarUpload
            onSubmit={(file) => {
              dispatch(changeZonePhoto(file, zoneId));
              setShowAvatarUpload(false);
            }}
            onDismiss={() => {
              setShowAvatarUpload(false);
            }}
          />
        )}
      </>
    ),
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
                setZonePayload({
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
                setZonePayload({
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
                setZonePayload({
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
                    setZonePayload({
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
