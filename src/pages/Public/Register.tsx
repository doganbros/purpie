import React, { FC } from 'react';
import { Form, FormField, Image, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { RegisterPayload } from '../../store/types/auth.types';
import { registerAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { validators } from '../../helpers/validators';
import Figure from '../../assets/register-bg/figure.png';
import AuthFormButton from '../../components/auth/AuthFormButton';

const Register: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const {
    register: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<RegisterPayload> = ({ value }) => {
    dispatch(registerAction(value));
  };

  return (
    <AuthLayout
      title="Register"
      formTitle="Create an Account"
      formSubTitle="Sign up to continue"
      callToAction={{
        title: 'Already have an account?',
        body: 'SIGN IN',
        onClick: () => history.push('/login'),
      }}
      background={
        <>
          <Image
            width="90%"
            alignSelf="center"
            margin={{ bottom: 'large' }}
            style={{ maxHeight: '80%', zIndex: 1 }}
            src={Figure}
          />
        </>
      }
    >
      <>
        <Form onSubmit={handleSubmit}>
          <FormField
            label="FULL NAME"
            name="fullName"
            htmlFor="fullNameInput"
            validate={validators.required('Full name')}
          >
            <TextInput id="fullNameInput" name="fullName" />
          </FormField>

          <FormField
            name="email"
            htmlFor="emailInput"
            label="EMAIL"
            validate={[validators.required('Email'), validators.email()]}
          >
            <TextInput id="emailInput" name="email" />
          </FormField>

          <FormField
            name="password"
            htmlFor="passwordInput"
            label="PASSWORD"
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
            label="CONFIRM PASSWORD"
            validate={[
              validators.required('Confirm password'),
              validators.equalsField('password', 'Passwords'),
            ]}
          >
            <TextInput id="password1Input" name="password1" type="password" />
          </FormField>
          <AuthFormButton
            primary
            margin={{ top: 'medium' }}
            disabled={loading}
            type="submit"
            label="SIGN UP"
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default Register;
