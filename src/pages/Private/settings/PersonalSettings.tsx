import React, { useState } from 'react';
import { Box, Button, Form, FormField, Stack, Text, TextInput } from 'grommet';
import { Edit, Hide, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { SettingsData } from './types';
import {
  updatePasswordAction,
  updateProfileInfoAction,
  updateProfilePhotoAction,
} from '../../../store/actions/auth.action';
import AvatarUpload from './AvatarUpload';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { validators } from '../../../helpers/validators';
import { UpdatePasswordPayload } from '../../../store/types/auth.types';
import { FormSubmitEvent } from '../../../models/form-submit-event';

const PersonalSettings: () => SettingsData | null = () => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const [userPayload, setUserPayload] = useState({
    userName: user?.userName || '',
    fullName: user?.fullName || '',
  });

  const [passwordPayload, setPasswordPayload] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
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

  const isPasswordFormInitialState =
    passwordPayload.currentPassword === '' ||
    passwordPayload.newPassword === '' ||
    passwordPayload.confirmNewPassword === '';

  const handleSubmitPassword: FormSubmitEvent<UpdatePasswordPayload> = ({
    value,
  }) => {
    if (Object.keys(value).length !== 0) {
      dispatch(updatePasswordAction(value));
    }
  };

  const handleSaveChanges = () => {
    if (!isFormInitialState) {
      dispatch(updateProfileInfoAction(userPayload));
    }
  };

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
              border={{ color: 'light-2', size: 'medium' }}
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
            <Box background="focus" round pad="xsmall">
              <Edit size="small" />
            </Box>
          </Stack>
          <Box>
            <Text>{user.fullName}</Text>
            <Text color="status-disabled">{user.userName}</Text>
            <Text color="status-disabled">{user.email}</Text>
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
            type="user"
            src={user?.displayPhoto}
          />
        )}
      </>
    ),
    items: [
      {
        key: 'username',
        title: t('settings.username'),
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
        key: 'pasword',
        title: t('settings.passwordChange'),
        component: (
          <Box gap="small">
            <Form onSubmit={handleSubmitPassword} id="passwordForm">
              <FormField
                name="currentPassword"
                htmlFor="currentPassword"
                validate={[validators.minLength(t('common.password'), 6)]}
              >
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    plain
                    name="currentPassword"
                    id="currentPassword"
                    type={reveal.current ? 'text' : 'password'}
                    placeholder={t('settings.currentPassword')}
                    autoComplete="new-password"
                    focusIndicator={false}
                    value={passwordPayload.currentPassword}
                    onChange={(event) =>
                      setPasswordPayload({
                        ...passwordPayload,
                        currentPassword: event.target.value,
                      })
                    }
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
              </FormField>

              <FormField
                name="newPassword"
                htmlFor="newPassword"
                validate={[
                  validators.minLength(t('common.password'), 6),
                  validators.equalsField(
                    'confirmNewPassword',
                    t('common.passwords')
                  ),
                ]}
              >
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    name="newPassword"
                    id="newPassword"
                    plain
                    type={reveal.new ? 'text' : 'password'}
                    placeholder={t('settings.newPassword')}
                    focusIndicator={false}
                    value={passwordPayload.newPassword}
                    onChange={(event) =>
                      setPasswordPayload({
                        ...passwordPayload,
                        newPassword: event.target.value,
                      })
                    }
                  />

                  <Button
                    icon={
                      reveal.new ? (
                        <View size="medium" />
                      ) : (
                        <Hide size="medium" />
                      )
                    }
                    onClick={() => setReveal({ ...reveal, new: !reveal.new })}
                  />
                </Box>
              </FormField>

              <FormField
                name="confirmNewPassword"
                htmlFor="confirmNewPassword"
                validate={[
                  validators.minLength(t('common.password'), 6),
                  validators.equalsField('newPassword', t('common.passwords')),
                ]}
              >
                <Box
                  direction="row"
                  justify="between"
                  align="center"
                  gap="small"
                  round="small"
                  pad="xxsmall"
                >
                  <TextInput
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    plain
                    type={reveal.confirm ? 'text' : 'password'}
                    placeholder={t('settings.confirmPassword')}
                    focusIndicator={false}
                    value={passwordPayload.confirmNewPassword}
                    onChange={(event) =>
                      setPasswordPayload({
                        ...passwordPayload,
                        confirmNewPassword: event.target.value,
                      })
                    }
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
              </FormField>
            </Form>
          </Box>
        ),
      },
    ],
    saveButton: (
      <Button
        disabled={isFormInitialState && isPasswordFormInitialState}
        onClick={handleSaveChanges}
        primary
        label={t('settings.save')}
        margin={{ vertical: 'medium' }}
        type="submit"
        form="passwordForm"
      />
    ),
  };
};

export default PersonalSettings;
