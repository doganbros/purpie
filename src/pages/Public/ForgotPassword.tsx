import { Form, FormField, Image, TextInput } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { resetPasswordRequestAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import Figure from '../../assets/forgotten-password-bg/figure.svg';
import Banner from '../../assets/forgotten-password-bg/banner.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';

const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    dispatch(resetPasswordRequestAction(value.email));
  };

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
            width="35%"
            src={Banner}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
              top: 0,
              left: 0,
            }}
          />
          <Image alignSelf="center" style={{ zIndex: 2 }} src={Figure} />
        </>
      }
    >
      <>
        <Form onSubmit={handleSubmit}>
          <FormField
            name="email"
            htmlFor="emailInput"
            label="EMAIL"
            validate={[validators.required('Email'), validators.email()]}
          >
            <TextInput id="emailInput" name="email" />
          </FormField>
          <AuthFormButton
            primary
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
