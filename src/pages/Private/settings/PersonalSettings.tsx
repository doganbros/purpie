import React, { useState } from 'react';
import { Box, Button, TextInput } from 'grommet';
import { Hide, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from '../../../store/reducers/root.reducer';
import { SettingsData } from './types';
import { AvatarItem } from './AvatarItem';
import { apiURL } from '../../../config/http';
import {
  changeProfileInfo,
  changeProfilePicture,
} from '../../../store/actions/auth.action';
import AvatarUpload from './AvatarUpload';

const PersonalSettings: () => SettingsData | null = () => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [userPayload, setUserPayload] = useState({
    userName: user?.userName || '',
    fullName: user?.fullName || '',
  });
  const [showAvatarUpload, setShowAvatarUpload] = useState(false);
  const [reveal, setReveal] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  if (!user) return null;
  return {
    id: 0,
    key: 'personalSettings',
    label: 'Personal Settings',
    url: 'personalSettings',
    name: user?.fullName,
    onSave: () => {
      dispatch(changeProfileInfo(userPayload));
    },
    avatarWidget: (
      <>
        <AvatarItem
          title={user.fullName}
          subtitle={user.userName}
          onClickEdit={() => setShowAvatarUpload(true)}
          src={`${apiURL}/user/display-photo/${user?.displayPhoto}`}
        />
        {showAvatarUpload && (
          <AvatarUpload
            onSubmit={(file) => {
              dispatch(changeProfilePicture(file));
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
        key: 'username',
        title: 'Username',
        description: 'Change username',
        value: user?.userName,
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <TextInput
              value={userPayload.userName}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setUserPayload({
                  ...userPayload,
                  userName: event.target.value,
                })
              }
            />
          </Box>
        ),
      },
      {
        key: 'fullName',
        title: 'Full Name',
        description: 'Change your name',
        value: user?.fullName,
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <TextInput
              value={userPayload.fullName}
              plain
              focusIndicator={false}
              onChange={(event) =>
                setUserPayload({
                  ...userPayload,
                  fullName: event.target.value,
                })
              }
            />
          </Box>
        ),
      },

      {
        key: 'email',
        title: 'Email',
        description: 'Your main email address',
        value: user?.email,
        component: (
          <Box
            direction="row"
            justify="between"
            align="center"
            border={{ size: 'xsmall', color: 'brand' }}
            round="small"
            gap="small"
            pad="xxsmall"
          >
            <TextInput value={user?.email} plain focusIndicator={false} />
          </Box>
        ),
      },
      {
        key: 'pasword',
        title: 'Password Change',
        description: 'Change your password',
        component: (
          <Box gap="small">
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
                plain
                type={reveal.current ? 'text' : 'password'}
                placeholder="Current Password"
                autoComplete="new-password"
                focusIndicator={false}
                onChange={() => {}}
              />
              <Button
                icon={
                  reveal.current ? (
                    <View size="medium" />
                  ) : (
                    <Hide size="medium" />
                  )
                }
                onClick={() =>
                  setReveal({ ...reveal, current: !reveal.current })
                }
              />
            </Box>
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
                plain
                type={reveal.new ? 'text' : 'password'}
                placeholder="New Password"
                focusIndicator={false}
                onChange={() => {}}
              />
              <Button
                icon={
                  reveal.new ? <View size="medium" /> : <Hide size="medium" />
                }
                onClick={() => setReveal({ ...reveal, new: !reveal.new })}
              />
            </Box>
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
                plain
                type={reveal.confirm ? 'text' : 'password'}
                placeholder="Confirm New Password"
                focusIndicator={false}
                onChange={() => {}}
              />
              <Button
                icon={
                  reveal.confirm ? (
                    <View size="medium" />
                  ) : (
                    <Hide size="medium" />
                  )
                }
                onClick={() =>
                  setReveal({ ...reveal, confirm: !reveal.confirm })
                }
              />
            </Box>
          </Box>
        ),
      },
    ],
  };
};

export default PersonalSettings;
