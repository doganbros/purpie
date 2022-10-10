import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Form, FormField, Image, Main, Text, TextInput } from 'grommet';
import { useTranslation } from 'react-i18next';
import { AppState } from '../../store/reducers/root.reducer';
import LogoHorizontalColor from '../../assets/octopus-logo/logo-horizontal-color.svg';
import { validators } from '../../helpers/validators';
import { useTitle } from '../../hooks/useTitle';
import { useResponsive } from '../../hooks/useResponsive';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { initializeUserAction } from '../../store/actions/auth.action';
import { RegisterPayload } from '../../store/types/auth.types';
import AuthFormButton from '../../components/auth/AuthFormButton';
import { USER_NAME_CONSTRAINT } from '../../helpers/constants';

const InitializeUser: FC = () => {
  const {
    isInitialUserSetup,
    initializeUser: { loading },
  } = useSelector((state: AppState) => state.auth);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const history = useHistory();

  const size = useResponsive();

  useTitle(t('InitializeUser.title'));

  useEffect(() => {
    if (!isInitialUserSetup) {
      history.push('/login');
    }
  }, []);

  const handleSubmit: FormSubmitEvent<RegisterPayload> = ({ value }) => {
    dispatch(initializeUserAction(value));
  };
  return (
    <Main
      background="#FFE7E3"
      height={{ min: '100vh' }}
      justify="center"
      align={size === 'small' ? 'stretch' : 'center'}
    >
      <Box
        width={size === 'small' ? 'auto' : '550px'}
        round="large"
        pad="large"
        margin="large"
        elevation="large"
        background="white"
      >
        <Box gap="medium">
          <Box direction="row" align="center" gap="small">
            <Image
              width={size === 'small' ? '140px' : '180px'}
              src={LogoHorizontalColor}
            />
          </Box>
          <Box gap="small">
            <Text size="xlarge" weight="bold">
              {t('InitializeUser.formTitle')}
            </Text>
            <Text size="small" margin="">
              {t('InitializeUser.formSubTitle')}
            </Text>
          </Box>
          <Form onSubmit={handleSubmit}>
            <FormField
              label={t('common.fullName')}
              validate={validators.required(t('common.fullName'))}
              name="fullName"
              htmlFor="fullNameInput"
            >
              <TextInput name="fullName" />
            </FormField>
            <FormField
              label={t('common.userName')}
              validate={[
                validators.required(t('common.userName')),
                validators.minLength(t('common.userName'), 6),
                validators.matches(
                  USER_NAME_CONSTRAINT,
                  t('common.invalidUserName')
                ),
              ]}
              name="userName"
              htmlFor="userNameInput"
            >
              <TextInput name="userName" />
            </FormField>
            <FormField
              name="email"
              htmlFor="emailInput"
              label={t('common.email')}
              validate={[
                validators.required(t('common.email')),
                validators.email(),
              ]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>
            <FormField
              label={t('common.password')}
              name="password"
              htmlFor="passwordInput"
              validate={[
                validators.required(t('common.password')),
                validators.minLength(t('common.password'), 6),
              ]}
            >
              <TextInput id="passwordInput" name="password" type="password" />
            </FormField>
            <FormField
              label={t('common.confirmPassword')}
              name="password1"
              htmlFor="password1Input"
              validate={[
                validators.required(t('common.confirmPassword')),
                validators.equalsField('password', t('common.passwords')),
              ]}
            >
              <TextInput id="password1Input" name="password1" type="password" />
            </FormField>
            <AuthFormButton
              primary
              margin={{ top: 'medium' }}
              disabled={loading}
              type="submit"
              label={t('InitializeUser.createAccount')}
            />
          </Form>
        </Box>
      </Box>
    </Main>
  );
};

export default InitializeUser;
