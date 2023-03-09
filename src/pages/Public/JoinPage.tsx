import { Box, Form, Image, Text } from 'grommet';
import { Apple, Google } from 'grommet-icons';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getThirdPartyUrlAction } from '../../store/actions/auth.action';
import { AppState } from '../../store/reducers/root.reducer';
import AuthLayout from '../../components/layouts/AuthLayout';
import SignInRect from '../../assets/sign-in-rect.svg';
import Figure from '../../assets/register-bg/figure.svg';
import Banner from '../../assets/register-bg/banner.svg';
import AuthFormButton from '../../components/auth/AuthFormButton';
import { theme } from '../../config/app-config';

const JoinPage: FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const {
    login: { loading },
    loginWithGoogle: { buttonLoading: googleAuthBtnLoading },
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

          <Box margin={{ vertical: 'small' }} style={{ textAlign: 'center' }}>
            <AuthFormButton
              label={<span />}
              color={theme.global?.colors?.['light-3']}
              backgroundColor={theme.global?.colors?.['light-3']}
              disabled={googleAuthBtnLoading}
              onClick={() => dispatch(getThirdPartyUrlAction('google'))}
              icon={<Google color="plain" size="28px" />}
              margin={{ bottom: 'small' }}
            />
            <AuthFormButton
              label={<span />}
              color={theme.global?.colors?.['dark-1']}
              backgroundColor={theme.global?.colors?.['dark-1']}
              onClick={() => dispatch(getThirdPartyUrlAction('apple'))}
              icon={<Apple color="white" size="28px" />}
              margin={{ bottom: 'small' }}
            />
          </Box>
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
