import React, { useState } from 'react';
import { Box, Button, Form, FormField, TextInput } from 'grommet';
import { Hide, View } from 'grommet-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../../store/reducers/root.reducer';
import { updatePasswordAction } from '../../../store/actions/auth.action';
import { validators } from '../../../helpers/validators';
import { UpdatePasswordPayload } from '../../../store/types/auth.types';
import { FormSubmitEvent } from '../../../models/form-submit-event';
import { Menu } from '../../../components/layouts/SettingsAndStaticPageLayout/types';

const PasswordSettings = (): Menu | null => {
  const {
    auth: { user },
  } = useSelector((state: AppState) => state);
  const dispatch = useDispatch();

  const [passwordPayload, setPasswordPayload] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [reveal, setReveal] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const { t } = useTranslation();

  if (!user) return null;

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

  return {
    key: 'passwordSettings',
    label: t('settings.securitySettings'),
    url: 'password-settings',
    header: null,
    action: null,
    items: [
      {
        key: 'pasword',
        label: t('settings.passwordChange'),
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
              <Box align="end">
                <Button
                  disabled={isPasswordFormInitialState}
                  primary
                  label={t('settings.save')}
                  margin={{ vertical: 'small' }}
                  type="submit"
                  form="passwordForm"
                />
              </Box>
            </Form>
          </Box>
        ),
      },
    ],
  };
};

export default PasswordSettings;
