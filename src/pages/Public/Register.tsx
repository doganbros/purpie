import { Box, Form, Image, Text } from 'grommet';
import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Banner from '../../assets/register-bg/banner.svg';
import Figure from '../../assets/register-bg/figure.svg';
import SignInRect from '../../assets/sign-in-rect.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';
import ThirdPartyAuthButtons from '../../components/auth/ThirdPartyAuthButtons';
import AuthLayout from '../../components/layouts/AuthLayout';
import { AppState } from '../../store/reducers/root.reducer';

const Register: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    login: { loading },
  } = useSelector((state: AppState) => state.auth);

  return (
    <AuthLayout
      title={t('JoinRegister.title')}
      formTitle={t('JoinRegister.formTitle')}
      formSubTitle={t('JoinRegister.formSubTitle')}
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
        <Form>
          <ThirdPartyAuthButtons />

          <Box
            fill="horizontal"
            direction="row"
            justify="center"
            align="center"
            margin={{ vertical: 'medium' }}
          >
            <Box basis="100%">
              <Image src={SignInRect} />
            </Box>
            <Box basis="30%" direction="row" justify="center">
              <Text margin={{ horizontal: 'small' }} size="small">
                {t('common.or')}
              </Text>
            </Box>
            <Box basis="100%">
              <Image src={SignInRect} />
            </Box>
          </Box>
          <AuthFormButton
            primary
            margin={{ top: 'xsmall' }}
            disabled={loading}
            type="submit"
            label={t('JoinRegister.signUp')}
            onClick={() => history.push('/register-with-email')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default Register;
