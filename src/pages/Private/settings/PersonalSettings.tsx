import React, { useContext, useState } from 'react';
import {
  Box,
  Button,
  ResponsiveContext,
  Stack,
  Text,
  TextInput,
} from 'grommet';
import { Camera } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import {
  updateProfileInfoAction,
  updateProfilePhotoAction,
} from '../../../store/actions/auth.action';
import AvatarUpload from './AvatarUpload';
import { UserAvatar } from '../../../components/utils/Avatars/UserAvatar';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const PersonalSettings = (): Menu | null => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();
  const size = useContext(ResponsiveContext);

  const [userPayload, setUserPayload] = useState({
    userName: user?.userName || '',
    fullName: user?.fullName || '',
  });

  const [showAvatarUpload, setShowAvatarUpload] = useState(false);

  const { t } = useTranslation();

  if (!user) return null;

  const isFormInitialState =
    userPayload.userName === user.userName &&
    userPayload.fullName === user.fullName;

  const handleSaveChanges = () => {
    if (!isFormInitialState) {
      dispatch(updateProfileInfoAction(userPayload));
    }
  };

  const headerContent = (
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
            <Camera size="small" />
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
          type="user/display-photo"
          src={user?.displayPhoto}
          id={user?.id}
          name={user?.fullName}
        />
      )}
    </>
  );

  return {
    key: 'personalSettings',
    label: t('settings.personalSettings'),
    url: 'personal-settings',
    header: headerContent,
    action: (
      <Button
        disabled={isFormInitialState}
        onClick={handleSaveChanges}
        primary
        label={t('settings.save')}
        margin={{ vertical: size === 'small' ? 'small' : 'medium' }}
        type="submit"
        form="passwordForm"
      />
    ),
    items: [
      {
        key: 'username',
        label: t('settings.username'),
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
        label: t('settings.fullName'),
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
    ],
  };
};

export default PersonalSettings;
