import { Button, Image } from 'grommet';
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Trans, useTranslation } from 'react-i18next';
import AuthLayout from '../../components/layouts/AuthLayout';
import { AppState } from '../../store/reducers/root.reducer';
import Figure from '../../assets/verify-email-bg/figure-1.png';
import Banner from '../../assets/verify-email-bg/banner.png';
import { useResponsive } from '../../hooks/useResponsive';
import { resendMailVerificationTokenAction } from '../../store/actions/auth.action';

interface Params {
  userId: string;
}

const VerifyUserEmailInfo: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const {
    resendMailVerificationToken: { loading },
  } = useSelector((state: AppState) => state.auth);

  const size = useResponsive();
  const history = useHistory();
  const { userId } = useParams<Params>();

  const submitResendMailVerificationToken = () =>
    dispatch(resendMailVerificationTokenAction(Number.parseInt(userId, 10)));

  return (
    <AuthLayout
      title={t('VerifyUserEmailInfo.title')}
      formTitle={t('VerifyUserEmailInfo.title')}
      formSubTitle={
        <Trans i18nKey="VerifyUserEmailInfo.formSubTitle">
          <span />
          <br />
          <span />
        </Trans>
      }
      background={
        <>
          <Image
            width="60%"
            src={Banner}
            style={{
              position: 'absolute',
              pointerEvents: 'none',
            }}
          />
          <Image
            width="85%"
            alignSelf="center"
            style={{ zIndex: 1 }}
            src={Figure}
          />
        </>
      }
      callToAction={{
        title: t('VerifyUserEmailInfo.resendLink'),
        body: t('VerifyUserEmailInfo.resend'),
        disabled: loading,
        onClick: submitResendMailVerificationToken,
      }}
    >
      <Button
        fill="horizontal"
        primary
        onClick={() => history.push('/login')}
        size={size}
        margin={{ top: '55%' }}
        type="submit"
        label={t('VerifyUserEmailInfo.goToSignIn')}
      />
    </AuthLayout>
  );
};

export default VerifyUserEmailInfo;
