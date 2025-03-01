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

const JoinPage: FC = () => {
  const history = useHistory();
  const { t } = useTranslation();

  const {
    login: { loading },
  } = useSelector((state: AppState) => state.auth);

  return (
    <AuthLayout
      title={t('Join.title')}
      formTitle={t('Join.formTitle')}
      formSubTitle={t('Join.formSubTitle')}
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
          <AuthFormButton
            primary
            margin={{ top: 'xsmall' }}
            disabled={loading}
            type="submit"
            label={t('common.signUp')}
            onClick={() => history.push('/register')}
          />

          <Box
            fill="horizontal"
            direction="row"
            justify="center"
            align="center"
            margin={{ vertical: 'medium' }}
          >
            <Box basis="80%">
              <Image src={SignInRect} />
            </Box>
            <Box basis="100%" direction="row" justify="center">
              <Text margin={{ horizontal: 'small' }} size="small">
                {t('Join.orSignInWith')}
              </Text>
            </Box>
            <Box basis="80%">
              <Image src={SignInRect} />
            </Box>
          </Box>
          <ThirdPartyAuthButtons />
          <Box>
            <h4> {t('Join.alreadyHaveAccount')}</h4>
          </Box>

          <AuthFormButton
            primary
            margin={{ top: 'xsmall' }}
            disabled={loading}
            type="submit"
            label={t('common.signIn')}
            onClick={() => history.push('/login')}
          />
        </Form>
      </>
    </AuthLayout>
  );
};

export default JoinPage;
