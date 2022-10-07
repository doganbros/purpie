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
import { useTranslate } from '../../hooks/useTranslate';

const Register: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const translate = useTranslate('Register');

  const {
    register: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<RegisterPayload> = ({ value }) => {
    dispatch(registerAction(value));
  };

  return (
    <AuthLayout
      title={translate('title')}
      formTitle={translate('formTitle')}
      formSubTitle={translate('formSubTitle')}
      callToAction={{
        title: translate('alreadyHaveAccount'),
        body: translate('signIn', true),
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
            label={translate('fullName')}
            name="fullName"
            htmlFor="fullNameInput"
            validate={validators.required(translate('fullName'))}
          >
            <TextInput id="fullNameInput" name="fullName" />
          </FormField>

          <FormField
            name="email"
            htmlFor="emailInput"
            label={translate('email')}
            validate={[
              validators.required(translate('email')),
              validators.email(),
            ]}
          >
            <TextInput id="emailInput" name="email" />
          </FormField>

          <FormField
            name="password"
            htmlFor="passwordInput"
            label={translate('password', true)}
            validate={[
              validators.required(translate('password', true)),
              validators.minLength(translate('password', true), 6),
            ]}
          >
            <TextInput id="passwordInput" name="password" type="password" />
          </FormField>
          <FormField
            name="password1"
            htmlFor="password1Input"
            label={translate('confirmPassword')}
            validate={[
              validators.required(translate('confirmPassword')),
              validators.equalsField('password', translate('passwords')),
            ]}
          >
            <TextInput id="password1Input" name="password1" type="password" />
          </FormField>
          <AuthFormButton
            primary
            margin={{ top: 'medium' }}
            disabled={loading}
            type="submit"
            label={translate('signUp')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default Register;
