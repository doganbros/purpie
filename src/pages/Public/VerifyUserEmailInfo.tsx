import { Button, Image } from 'grommet';
import React, { FC } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
      title="Email Confirmation"
      formTitle="Email Confirmation"
      formSubTitle={
        <>
          <span>Verify your email to finish signing up for Octopus.</span>
          <br />
          <span>Please check your email box.</span>
        </>
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
        title: 'Resend mail verification link?',
        body: 'RESEND',
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
        label="GO TO SIGN IN"
      />
    </AuthLayout>
  );
};

export default VerifyUserEmailInfo;
