import { Box, Form, FormField, Image, Text, TextInput } from 'grommet';
import { FacebookOption, Google } from 'grommet-icons';
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
import SignInRect from '../../assets/sign-in-rect.svg';
import Figure from '../../assets/login-bg/figure.png';
import Banner from '../../assets/login-bg/banner.png';
import AuthFormButton from '../../components/auth/AuthFormButton';

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
      formTitle="Welcome Back!"
      formSubTitle="Sign In to continue."
      background={
        <>
          <Image
            width="60%"
            src={Banner}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
          <Image
            width="85%"
            alignSelf="center"
            style={{ zIndex: 1 }}
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
        <Form onSubmit={handleSubmit}>
          <FormField
            name="emailOrUserName"
            htmlFor="emailOrUserNameInput"
            label="EMAIL / USERNAME"
            validate={[validators.required()]}
          >
            <TextInput id="emailOrUserNameInput" name="emailOrUserName" />
          </FormField>
          <FormField
            name="password"
            htmlFor="passwordInput"
            label="PASSWORD"
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
              size="small"
              label="Forgot Password?"
              to="/forgot-password"
            />
          </Box>
          <AuthFormButton
            primary
            margin={{ top: 'medium' }}
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
            <Box basis="80%">
              <Image src={SignInRect} />
            </Box>
            <Box basis="100%" direction="row" justify="center">
              <Text margin={{ horizontal: 'small' }} size="small">
                Or Sign in With
              </Text>
            </Box>
            <Box basis="80%">
              <Image src={SignInRect} />
            </Box>
          </Box>

          <Box margin={{ vertical: 'small' }} style={{ textAlign: 'center' }}>
            <AuthFormButton
              label={<span />}
              color="#F3F3F3"
              backgroundColor="#F3F3F3"
              disabled={googleAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('google'))}
              icon={<Google color="plain" size="28px" />}
              margin={{ bottom: 'small' }}
            />

            <AuthFormButton
              label={<span />}
              color="#3B5998"
              backgroundColor="#3B5998"
              disabled={facebookAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('facebook'))}
              icon={<FacebookOption color="white" size="28px" />}
            />
          </Box>
        </Form>
      </>
    </AuthLayout>
  );
};

export default Login;
