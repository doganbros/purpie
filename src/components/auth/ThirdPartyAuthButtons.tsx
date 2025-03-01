import React, { FC } from 'react';
import { Box, Image } from 'grommet';
import { useDispatch, useSelector } from 'react-redux';
import { Google, Apple } from 'grommet-icons';
import { theme } from '../../config/app-config';
import AuthFormButton from './AuthFormButton';
import { AppState } from '../../store/reducers/root.reducer';
import {
  getThirdPartyUrlAction,
  loginWithMetamaskAction,
} from '../../store/actions/auth.action';
import MetamaskLogo from '../../assets/metamask-icon.svg';

const ThirdPartyAuthButtons: FC = () => {
  const dispatch = useDispatch();
  const {
    loginWithGoogle: { buttonLoading: googleAuthBtnLoading },
    loginWithMetamask: { loading: metamaskLoading },
  } = useSelector((state: AppState) => state.auth);

  const handleMetamaskLogin = () => {
    dispatch(loginWithMetamaskAction());
  };

  return (
    <Box margin={{ vertical: 'small' }} style={{ textAlign: 'center' }}>
      <AuthFormButton
        label={<span />}
        color={theme.global?.colors?.['light-3']}
        backgroundColor={theme.global?.colors?.['light-3']}
        disabled={metamaskLoading}
        onClick={handleMetamaskLogin}
        icon={<Image src={MetamaskLogo} width="24px" height="24px" />}
        margin={{ bottom: 'small' }}
      />
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
  );
};

export default ThirdPartyAuthButtons;
