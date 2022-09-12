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
            label="FIRST NAME"
            name="firstName"
            htmlFor="firstNameInput"
            validate={validators.required()}
          >
            <TextInput id="firstNameInput" name="firstName" />
          </FormField>
          <FormField
            label="LAST NAME"
            name="lastName"
            htmlFor="lastNameInput"
            validate={validators.required()}
          >
            <TextInput id="lastNameInput" name="lastName" />
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
            name="password"
            htmlFor="passwordInput"
            label="PASSWORD"
            validate={[validators.required(), validators.minLength(6)]}
          >
            <TextInput id="passwordInput" name="password" type="password" />
          </FormField>
          <FormField
            name="password1"
            htmlFor="password1Input"
            label="CONFIRM PASSWORD"
            validate={[
              validators.required(),
              validators.equalsField('password', 'Password'),
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
