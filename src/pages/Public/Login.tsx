import {
  Box,
  Form,
  FormField,
  Button,
  Image,
  Text,
  TextInput,
  Heading,
} from 'grommet';
import { Google, FacebookOption } from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
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
import Logo from '../../assets/octopus-logo/logo-color.png';
import SignInRect from '../../assets/sign-in-rect.svg';
import Figure from '../../assets/login-bg/figure.png';
import Banner from '../../assets/login-bg/banner.png';

const Login: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    login: { loading },
    loginWithGoogle: { buttonLoading: googleAuthBtnLoading },
    loginWithFacebook: { buttonLoading: facebookAuthBtnLoading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<LoginPayload> = ({ value }) => {
    dispatch(loginAction(value));
  };

  return (
    <AuthLayout
      title="Login"
      background={
        <>
          <Image
            width="100%"
            src={Banner}
            style={{
              position: 'absolute',
              top: '35%',
              pointerEvents: 'none',
              left: '50%',
              transform: 'translate(-50%, -35%)',
            }}
          />
          <Image
            width="70%"
            margin={{ bottom: 'large' }}
            style={{ maxHeight: '70%', zIndex: 2 }}
            src={Figure}
          />
        </>
      }
      callToAction={{
        title: 'Don’t have an account?',
        body: 'CREATE AN ACCOUNT',
        onClick: () => history.push('/register'),
      }}
    >
      <>
        <Box
          margin={{ bottom: 'xsmall' }}
          direction="row"
          align="center"
          fill="horizontal"
        >
          <Image
            margin={{ right: 'xsmall' }}
            width="50px"
            height="50px"
            src={Logo}
          />
          <Text color="primary">octopus</Text>
        </Box>
        <Heading level="1" margin={{ bottom: 'xxsmall' }}>
          Welcome Back!
        </Heading>
        <Text size="small" margin={{ left: 'xsmall', bottom: 'medium' }}>
          Sign In to continue.
        </Text>

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
          <Box
            direction="row"
            margin={{ bottom: 'medium' }}
            alignSelf="center"
            gap="xsmall"
          >
            <AnchorLink
              weight="normal"
              label="Forgot Password?"
              to="/forgot-password"
            />
          </Box>
          <Button
            fill="horizontal"
            hoverIndicator="background"
            primary
            size="large"
            disabled={loading}
            type="submit"
            label="SIGN IN"
          />

          <Box
            fill="horizontal"
            direction="row"
            justify="center"
            align="center"
            margin={{ vertical: 'medium' }}
          >
            <Box basis="100%">
              <Image src={SignInRect} />
            </Box>
            <Box basis="100%" direction="row" justify="center">
              <Text margin={{ horizontal: 'small' }} size="small">
                Or Sign In With
              </Text>
            </Box>
            <Box basis="100%">
              <Image src={SignInRect} />
            </Box>
          </Box>

          <Box
            margin={{ bottom: 'medium', top: 'large' }}
            align="center"
            style={{ textAlign: 'center' }}
          >
            <Button
              label="Google"
              size="large"
              disabled={googleAuthBtnLoading}
              fill="horizontal"
              secondary
              hoverIndicator="background"
              onClick={() => dispatch(getThirdPartyUrlAction('google'))}
              icon={<Google />}
              margin={{ right: 'small', bottom: 'small' }}
            />
            <Button
              size="large"
              fill="horizontal"
              primary
              label="Facebook"
              disabled={facebookAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('facebook'))}
              icon={<FacebookOption />}
            />
          </Box>
        </Form>
      </>
    </AuthLayout>
  );
};

export default Login;
