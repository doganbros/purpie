import {
  Box,
  Form,
  FormField,
  Button,
  Heading,
  Text,
  TextInput,
  Card,
  CardBody,
} from 'grommet';
import { Facebook, Google } from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnchorLink } from '../../components/utils/AnchorLink';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import {
  getThirdPartyUrlAction,
  loginAction,
} from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import { LoginPayload } from '../../store/types/auth.types';
import AuthLayout from '../../components/layouts/AuthLayout';

const Login: FC = () => {
  const dispatch = useDispatch();

  const {
    login: { loading },
    loginWithGoogle: { buttonLoading: googleAuthBtnLoading },
    loginWithFacebook: { buttonLoading: facebookAuthBtnLoading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<LoginPayload> = ({ value }) => {
    dispatch(loginAction(value));
  };

  return (
    <AuthLayout title="Login">
      <Card
        elevation="xsmall"
        background="light-1"
        overflow="auto"
        width={{ min: '30%' }}
        margin={{ horizontal: '10px' }}
      >
        <CardBody margin="medium">
          <Heading margin={{ bottom: 'medium' }} level="3">
            Login
          </Heading>
          <Box justify="between" direction="row" margin={{ bottom: 'medium' }}>
            <Button
              label={`Login With Google${googleAuthBtnLoading ? '...' : ''}`}
              size="small"
              disabled={googleAuthBtnLoading}
              fill="horizontal"
              onClick={() => dispatch(getThirdPartyUrlAction('google'))}
              icon={<Google />}
              margin={{ right: 'small' }}
            />
            <Button
              size="small"
              fill="horizontal"
              primary
              disabled={facebookAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('facebook'))}
              label={`Login With Facebook${
                facebookAuthBtnLoading ? ' ...' : ''
              }`}
              icon={<Facebook />}
            />
          </Box>
          <Form onSubmit={handleSubmit}>
            <FormField
              name="email"
              htmlFor="emailInput"
              label="Email"
              validate={[validators.required(), validators.email()]}
            >
              <TextInput id="emailInput" name="email" type="email" />
            </FormField>
            <FormField
              name="password"
              htmlFor="passwordInput"
              label="Password"
              validate={[validators.required(), validators.minLength(6)]}
            >
              <TextInput id="passwordInput" name="password" type="password" />
            </FormField>
            <Box pad={{ vertical: 'medium' }} align="end">
              <Button
                fill="horizontal"
                hoverIndicator="background"
                primary
                disabled={loading}
                type="submit"
                label="Go!"
              />
            </Box>
            <Box direction="row" alignSelf="center" gap="xsmall">
              <Text>Not registered yet?</Text>
              <AnchorLink label="Create an account!" to="/register" />
            </Box>
            <Box direction="row" alignSelf="center" gap="xsmall">
              <AnchorLink label="Forgot Password?" to="/forgot-password" />
            </Box>
          </Form>
        </CardBody>
      </Card>
    </AuthLayout>
  );
};

export default Login;
