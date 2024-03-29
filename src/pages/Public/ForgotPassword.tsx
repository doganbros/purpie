import { Form, FormField, Image, TextInput } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const handleSubmit: FormSubmitEvent<{ email: string }> = ({ value }) => {
    dispatch(resetPasswordRequestAction(value.email));
  };

  return (
    <AuthLayout
      title={t('ForgotPassword.title')}
      formTitle={t('ForgotPassword.formTitle')}
      formSubTitle={t('ForgotPassword.formSubTitle')}
      callToAction={{
        title: t('ForgotPassword.rememberPassword'),
        body: t('common.signIn'),
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
            label={t('common.email')}
            validate={[
              validators.required(t('common.email')),
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
            label={t('ForgotPassword.send')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default ForgotPassword;
