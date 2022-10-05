import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Form, FormField, Image, Main, Text, TextInput } from 'grommet';
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

  const history = useHistory();

  const size = useResponsive();

  useTitle('Initialize User - Octopus');

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
              Welcome to Octopus!
            </Text>
            <Text size="small" margin="">
              Sign up with an account to continue
            </Text>
          </Box>
          <Form onSubmit={handleSubmit}>
            <FormField
              label="FULL NAME"
              validate={validators.required('Full name')}
              name="fullName"
              htmlFor="fullNameInput"
            >
              <TextInput name="fullName" />
            </FormField>
            <FormField
              label="USERNAME"
              validate={[
                validators.required('User name'),
                validators.minLength('Username', 6),
                validators.matches(USER_NAME_CONSTRAINT, 'Invalid Username'),
              ]}
              name="userName"
              htmlFor="userNameInput"
            >
              <TextInput name="userName" />
            </FormField>
            <FormField
              name="email"
              htmlFor="emailInput"
              label="EMAIL"
              validate={[validators.required('Email'), validators.email()]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>
            <FormField
              label="PASSWORD"
              name="password"
              htmlFor="passwordInput"
              validate={[
                validators.required('Password'),
                validators.minLength('Password', 6),
              ]}
            >
              <TextInput id="passwordInput" name="password" type="password" />
            </FormField>
            <FormField
              label="CONFIRM PASSWORD"
              name="password1"
              htmlFor="password1Input"
              validate={[
                validators.required('Confirm password'),
                validators.equalsField('password', 'password'),
              ]}
            >
              <TextInput id="password1Input" name="password1" type="password" />
            </FormField>
            <AuthFormButton
              primary
              margin={{ top: 'medium' }}
              disabled={loading}
              type="submit"
              label="CREATE ACCOUNT"
            />
          </Form>
        </Box>
      </Box>
    </Main>
  );
};

export default InitializeUser;
