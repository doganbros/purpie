import { Image } from 'grommet';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import AuthLayout from '../../components/layouts/AuthLayout';
import { AppState } from '../../store/reducers/root.reducer';
import Figure from '../../assets/verify-email-bg/figure-1.png';
import Banner from '../../assets/verify-email-bg/banner.png';
import AuthFormButton from '../../components/auth/AuthFormButton';

const VerifyEmail: FC = () => {
  const {
    forgotPassword: { loading },
  } = useSelector((state: AppState) => state.auth);

  const history = useHistory();

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
    >
      <AuthFormButton
        primary
        onClick={() => history.push('/login')}
        margin={{ top: '55%' }}
        disabled={loading}
        type="submit"
        label="GO TO SIGN IN"
      />
    </AuthLayout>
  );
};

export default VerifyEmail;
