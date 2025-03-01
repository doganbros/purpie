import { Box, Form, FormField, TextInput } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import Banner from '../../assets/login-bg/banner.svg';
import Figure from '../../assets/login-bg/figure.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';
import AuthLayout from '../../components/layouts/AuthLayout';
import { validators } from '../../helpers/validators';
import { FormSubmitEvent } from '../../models/form-submit-event';
import { registerWithMetamaskAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';

interface MetamaskRegisterFormValues {
  fullName: string;
  email: string;
}

const MetamaskRegister: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();

  const {
    registerWithMetamask: { loading },
  } = useSelector((state: AppState) => state.auth);

  // Get wallet address from URL query params
  const queryParams = new URLSearchParams(location.search);
  const walletAddress = queryParams.get('walletAddress') || '';
  const signature = queryParams.get('signature') || '';

  const handleSubmit: FormSubmitEvent<MetamaskRegisterFormValues> = ({
    value,
  }) => {
    dispatch(
      registerWithMetamaskAction({
        fullName: value.fullName,
        email: value.email,
        walletAddress,
        signature,
      })
    );
  };

  return (
    <AuthLayout
      title={t('MetamaskRegister.title')}
      formTitle={t('MetamaskRegister.formTitle')}
      formSubTitle={t('MetamaskRegister.formSubTitle')}
      background={
        <>
          <Box
            width="60%"
            style={{
              position: 'absolute',
              pointerEvents: 'none',
            }}
          >
            <img src={Banner} alt="Banner" width="100%" />
          </Box>
          <Box width="100%" alignSelf="center" style={{ zIndex: 1 }}>
            <img src={Figure} alt="Figure" width="100%" />
          </Box>
        </>
      }
      callToAction={{
        title: t('MetamaskRegister.alreadyHaveAccount'),
        body: t('common.signIn'),
        onClick: () => history.push('/login'),
      }}
    >
      <>
        <Form onSubmit={handleSubmit}>
          <FormField
            name="fullName"
            htmlFor="fullNameInput"
            label={t('common.fullName')}
            validate={[validators.required(t('common.fullName'))]}
          >
            <TextInput id="fullNameInput" name="fullName" />
          </FormField>
          <FormField
            name="email"
            htmlFor="emailInput"
            label={t('common.email')}
            validate={[
              validators.required(t('common.email')),
              validators.email(t('common.email')),
            ]}
          >
            <TextInput id="emailInput" name="email" type="email" />
          </FormField>

          <AuthFormButton
            primary
            margin={{ top: 'medium' }}
            disabled={loading}
            type="submit"
            label={t('MetamaskRegister.signUp')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default MetamaskRegister;
