import { Box, Form, FormField, Button, Image, Text, TextInput } from 'grommet';
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
import SignInRect from '../../assets/sign-in-rect.svg';
import Figure from '../../assets/login-bg/figure.png';
import Banner from '../../assets/login-bg/banner.png';
import { useResponsive } from '../../hooks/useResponsive';

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

  const size = useResponsive();

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
            name="email"
            htmlFor="emailInput"
            label="EMAIL"
            validate={[validators.required(), validators.email()]}
          >
            <TextInput id="emailInput" name="email" type="email" />
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
          <Button
            fill="horizontal"
            hoverIndicator="background"
            primary
            margin={{ top: 'medium' }}
            size={size}
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
                Or Sign In With
              </Text>
            </Box>
            <Box basis="80%">
              <Image src={SignInRect} />
            </Box>
          </Box>

          <Box
            margin={{ vertical: 'small' }}
            align="center"
            style={{ textAlign: 'center' }}
          >
            <Button
              label={<span />}
              size={size}
              style={{ backgroundColor: '#F3F3F3', border: 'none' }}
              disabled={googleAuthBtnLoading}
              fill="horizontal"
              hoverIndicator="background"
              onClick={() => dispatch(getThirdPartyUrlAction('google'))}
              icon={
                <Google
                  color="plain"
                  size={size === 'large' ? '30px' : 'medium'}
                  style={{ marginLeft: '10px' }}
                />
              }
              margin={{ right: 'small', bottom: 'small' }}
            />

            <Button
              size={size}
              label={<span />}
              style={{ backgroundColor: '#3B5998' }}
              fill="horizontal"
              primary
              disabled={facebookAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('facebook'))}
              icon={
                <FacebookOption size={size === 'large' ? '33px' : 'medium'} />
              }
            />
          </Box>
        </Form>
      </>
    </AuthLayout>
  );
};

export default Login;
