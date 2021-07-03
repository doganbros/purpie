import { Button, Form, FormField, TextInput, Image } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { forgetPasswordAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import Figure from '../../assets/forgotten-password-bg/figure-1.png';
import Banner from '../../assets/forgotten-password-bg/banner.png';
import { useResponsive } from '../../hooks/useResponsive';

const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    dispatch(forgetPasswordAction(value.email));
  };

  const size = useResponsive();

  return (
    <AuthLayout
      title="Forgot Password"
      formTitle="Password Recovery"
      formSubTitle="Enter email to receive your password."
      callToAction={{
        title: 'Remember Password?',
        body: 'SIGN IN',
        onClick: () => history.push('/login'),
      }}
      background={
        <>
          <Image
            width="60%"
            src={Banner}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: 0,
              left: 0,
              height: '100vh',
            }}
          />
          <Image
            height="90%"
            alignSelf="center"
            style={{ zIndex: 2 }}
            src={Figure}
          />
        </>
      }
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
          <Button
            fill="horizontal"
            primary
            size={size}
            margin={{ top: '55%' }}
            disabled={loading}
            type="submit"
            label="SEND"
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default ForgotPassword;
