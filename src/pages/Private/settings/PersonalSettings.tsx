import React, { useState } from 'react';
import { Box, Button, Stack, Text, TextInput } from 'grommet';
import { Edit, Hide, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { SettingsData } from './types';
import {
  updateProfileInfoAction,
  updateProfilePhotoAction,
} from '../../../store/actions/auth.action';
import AvatarUpload from './AvatarUpload';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';

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
  const { t } = useTranslation();
  if (!user) return null;

  const isFormInitialState =
    userPayload.userName === user.userName &&
    userPayload.fullName === user.fullName;
  return {
    id: 0,
    key: 'personalSettings',
    label: t('settings.personalSettings'),
    url: 'personalSettings',
    name: user?.fullName,

    avatarWidget: (
      <>
        <Box direction="row" gap="small" align="center">
          <Stack anchor="top-right" onClick={() => setShowAvatarUpload(true)}>
            <Box
              round="full"
              border={{ color: '#F2F2F2', size: 'medium' }}
              wrap
              justify="center"
              pad="5px"
            >
              <UserAvatar
                src={user?.displayPhoto}
                name={user.fullName}
                id={user?.id}
              />
            </Box>
            <Box background="#6FFFB0" round pad="xsmall">
              <Edit size="small" />
            </Box>
          </Stack>
          <Box>
            <Text>{user.fullName}</Text>
            <Text color="#8F9BB3">{user.userName}</Text>
          </Box>
        </Box>

        {showAvatarUpload && (
          <AvatarUpload
            onSubmit={(file: any) => {
              dispatch(updateProfilePhotoAction(file));
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
        title: t('settings.username'),
        description: t('settings.changeUsername'),
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
        title: t('settings.fullName'),
        description: t('settings.changeName'),
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
        title: t('settings.email'),
        description: t('settings.mainEmail'),
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
        title: t('settings.passwordChange'),
        description: t('settings.changePassword'),
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
                placeholder={t('settings.currentPassword')}
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
                placeholder={t('settings.newPassword')}
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
                placeholder={t('settings.confirmPassword')}
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
    saveButton: (
      <Button
        disabled={isFormInitialState}
        onClick={() => {
          dispatch(updateProfileInfoAction(userPayload));
        }}
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
      />
    ),
  };
};

export default PersonalSettings;
