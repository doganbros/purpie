import { Form, FormField, Image, TextInput } from 'grommet';
import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { resetPasswordAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import Figure from '../../assets/forgotten-password-bg/figure.svg';
import Banner from '../../assets/forgotten-password-bg/banner.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';

interface Params {
  token: string;
}

const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const { token } = useParams<Params>();

  const {
    resetPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit = (payload: Record<string, any>) => {
    dispatch(
      resetPasswordAction({
        password: payload.value.password,
        token,
      })
    );
  };

  return (
    <AuthLayout
      title="Reset Password"
      formTitle="Change Password"
      formSubTitle="Enter a new password for your account."
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
            name="password"
            htmlFor="passwordInput"
            label="Password"
            validate={[
              validators.required('Password'),
              validators.minLength('Password', 6),
            ]}
          >
            <TextInput id="passwordInput" name="password" type="password" />
          </FormField>
          <FormField
            name="password1"
            htmlFor="password1Input"
            label="Confirm Password"
            validate={[
              validators.required('Confirm password'),
              validators.equalsField('password', 'Password'),
            ]}
          >
            <TextInput id="password1Input" name="password1" type="password" />
          </FormField>
          <AuthFormButton
            primary
            margin={{ top: 'large' }}
            disabled={loading}
            type="submit"
            label="GO"
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default ResetPassword;
