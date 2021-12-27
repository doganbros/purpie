import React, { FC, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Button,
  Form,
  FormField,
  Image,
  Main,
  Text,
  TextInput,
} from 'grommet';
import { AppState } from '../../store/reducers/root.reducer';
import Logo from '../../assets/octopus-logo/logo-color.svg';
import OctopusText from '../../assets/octopus-logo/octopus-text-2.png';
import { validators } from '../../helpers/validators';
import { useTitle } from '../../hooks/useTitle';
import { useResponsive } from '../../hooks/useResponsive';

const InitializeUser: FC = () => {
  const {
    isInitialUserSetup,
    register: { loading },
  } = useSelector((state: AppState) => state.auth);

  const history = useHistory();

  const size = useResponsive();

  useTitle('Initialize User - Octopus');

  useEffect(() => {
    if (!isInitialUserSetup) history.push('/login');
  }, []);

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
            <Image height="54px" width="54px" src={Logo} />
            <Image height="24px" src={OctopusText} />
          </Box>
          <Box gap="small">
            <Text size="xlarge" weight="bold">
              Create an Admin Account
            </Text>
            <Text size="small" margin="">
              Sign up with an admin account to continue
            </Text>
          </Box>
          <Form>
            <FormField
              label="FIRST NAME"
              validate={validators.required()}
              name="firstName"
              htmlFor="firstNameInput"
            >
              <TextInput name="firstName" />
            </FormField>
            <FormField
              label="LAST NAME"
              validate={validators.required()}
              name="lastName"
              htmlFor="lastNameInput"
            >
              <TextInput name="lastName" />
            </FormField>
            <FormField
              label="USERNAME"
              validate={validators.required()}
              name="userName"
              htmlFor="userNameInput"
            >
              <TextInput name="userName" />
            </FormField>
            <FormField
              name="email"
              htmlFor="emailInput"
              label="EMAIL"
              validate={[validators.required(), validators.email()]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>
            <FormField
              label="PASSWORD"
              name="password"
              htmlFor="passwordInput"
              validate={[validators.required(), validators.minLength(6)]}
            >
              <TextInput id="passwordInput" name="password" type="password" />
            </FormField>
            <FormField
              label="CONFIRM PASSWORD"
              name="password1"
              htmlFor="password1Input"
              validate={[
                validators.required(),
                validators.equalsField('password', 'password'),
              ]}
            >
              <TextInput id="password1Input" name="password1" type="password" />
            </FormField>
            <Button
              fill="horizontal"
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
