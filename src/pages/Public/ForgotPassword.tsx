import { Form, FormField, Image, TextInput } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { resetPasswordRequestAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import Figure from '../../assets/forgotten-password-bg/figure-1.png';
import Banner from '../../assets/forgotten-password-bg/banner.png';
import AuthFormButton from '../../components/auth/AuthFormButton';
import { useTranslate } from '../../hooks/useTranslate';

const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const t = useTranslate('ForgotPassword');

  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    dispatch(resetPasswordRequestAction(value.email));
  };

  return (
    <AuthLayout
      title={t('title')}
      formTitle={t('formTitle')}
      formSubTitle={t('formSubTitle')}
      callToAction={{
        title: t('rememberPassword'),
        body: t('signIn', true),
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
            label={t('email', true)}
            validate={[
              validators.required(t('email', true)),
              validators.email(),
            ]}
          >
            <TextInput id="emailInput" name="email" />
          </FormField>
          <AuthFormButton
            primary
            margin={{ top: '55%' }}
            disabled={loading}
            type="submit"
            label={t('send')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default ForgotPassword;
