import React, { FC } from 'react';
import { Form, FormField, Image, TextInput } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { useTranslation } from 'react-i18next';
import { RegisterPayload } from '../../store/types/auth.types';
import { registerAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { validators } from '../../helpers/validators';
import Figure from '../../assets/register-bg/figure.svg';
import Banner from '../../assets/register-bg/banner.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';

const RegisterWithEmail: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const {
    register: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<RegisterPayload> = ({ value }) => {
    dispatch(registerAction(value));
  };

  return (
    <AuthLayout
      title={t('Register.title')}
      formTitle={t('Register.formTitle')}
      formSubTitle={t('Register.formSubTitle')}
      callToAction={{
        title: t('Register.alreadyHaveAccount'),
        body: t('common.signIn'),
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
              left: 250,
            }}
          />
          <Image
            width="60%"
            alignSelf="center"
            style={{ zIndex: 1 }}
            src={Figure}
          />
        </>
      }
    >
      <>
        <Form onSubmit={handleSubmit}>
          <FormField
            label={t('common.fullName')}
            name="fullName"
            htmlFor="fullNameInput"
            validate={validators.required(t('common.fullName'))}
          >
            <TextInput id="fullNameInput" name="fullName" />
          </FormField>

          <FormField
            name="email"
            htmlFor="emailInput"
            label={t('common.email')}
            validate={[
              validators.required(t('common.email')),
              validators.email(),
            ]}
          >
            <TextInput id="emailInput" name="email" />
          </FormField>

          <FormField
            name="password"
            htmlFor="passwordInput"
            label={t('common.password')}
            validate={[
              validators.required(t('common.password')),
              validators.minLength(t('common.password'), 6),
            ]}
          >
            <TextInput id="passwordInput" name="password" type="password" />
          </FormField>
          <FormField
            name="password1"
            htmlFor="password1Input"
            label={t('common.confirmPassword')}
            validate={[
              validators.required(t('common.confirmPassword')),
              validators.equalsField('password', t('common.passwords')),
            ]}
          >
            <TextInput id="password1Input" name="password1" type="password" />
          </FormField>
          <AuthFormButton
            primary
            margin={{ top: 'medium' }}
            disabled={loading}
            type="submit"
            label={t('Register.signUp')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default RegisterWithEmail;
