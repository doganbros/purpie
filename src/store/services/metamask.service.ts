import { http } from '../../config/http';
import { SignInResponse, User } from '../types/auth.types';
import { store } from '../store';
import { setToastAction } from '../actions/util.action';

/**
 * Check if Metamask is installed
 * @returns True if Metamask is installed, false otherwise
 */
export const isMetamaskInstalled = (): boolean => {
  return (
    typeof window !== 'undefined' && typeof window.ethereum !== 'undefined'
  );
};

/**
 * Get the current Metamask account
 * @returns The current Metamask account or null if not connected
 */
export const getCurrentAccount = async (): Promise<string | null> => {
  if (!isMetamaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    const action = setToastAction(
      'error',
      `Error getting Metamask account: ${error.message}`
    );
    action(store.dispatch);
    return null;
  }
};

/**
 * Connect to Metamask
 * @returns The connected account or null if connection failed
 */
export const connectToMetamask = async (): Promise<string | null> => {
  if (!isMetamaskInstalled()) {
    window.open('https://metamask.io/download/', '_blank');
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    const action = setToastAction(
      'error',
      `Error connecting to Metamask: ${error.message}`
    );
    action(store.dispatch);
    return null;
  }
};

/**
 * Get a nonce for the wallet address
 * @param walletAddress The wallet address to get a nonce for
 * @returns The nonce
 */
export const getNonce = async (walletAddress: string): Promise<string> => {
  const response = await http.post('/auth/metamask/nonce', { walletAddress });
  return response.data.nonce;
};

/**
 * Sign a message with Metamask
 * @param message The message to sign
 * @param account The account to sign with
 * @returns The signature
 */
export const signMessage = async (
  message: string,
  account: string
): Promise<string> => {
  try {
    const signature = await window.ethereum.request({
      method: 'personal_sign',
      params: [message, account],
    });
    return signature;
  } catch (error) {
    const action = setToastAction(
      'error',
      `Error signing message with Metamask: ${error.message}`
    );
    action(store.dispatch);
    throw error;
  }
};

/**
 * Login with Metamask
 * @param walletAddress The wallet address to login with
 * @param signature The signature of the nonce
 * @returns The login response
 */
export const loginWithMetamask = async (
  walletAddress: string,
  signature: string
): Promise<SignInResponse> => {
  const response = await http.post(
    '/auth/metamask/login',
    {
      walletAddress,
      signature,
    },
    {
      showErrorToast: (err) => {
        return (
          err?.response?.data?.message !== 'MUST_VERIFY_EMAIL' &&
          err?.response?.data?.message !== 'USER_NOT_FOUND'
        );
      },
    }
  );
  return response.data;
};

/**
 * Register with Metamask
 * @param walletAddress The wallet address to register with
 * @param signature The signature of the nonce
 * @param fullName The full name of the user
 * @param email The email of the user
 * @returns The registered user
 */
export const registerWithMetamask = async (
  walletAddress: string,
  signature: string,
  fullName: string,
  email: string
): Promise<User> => {
  const response = await http.post('/auth/metamask/register', {
    walletAddress,
    signature,
    fullName,
    email,
  });
  return response.data;
};
