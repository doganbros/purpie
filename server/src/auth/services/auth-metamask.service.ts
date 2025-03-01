import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { Repository } from 'typeorm';
import { ethers } from 'ethers';
import { nanoid } from 'nanoid';
import { AuthService } from './auth.service';
import { MetamaskLoginDto } from '../dto/metamask-login.dto';
import { MetamaskRegisterDto } from '../dto/metamask-register.dto';
import { ErrorTypes } from '../../../types/ErrorTypes';

@Injectable()
export class AuthMetamaskService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private authService: AuthService,
  ) {}

  /**
   * Generate a new nonce for a wallet address
   * @param walletAddress The wallet address to generate a nonce for
   * @returns The generated nonce
   */
  async generateNonce(walletAddress: string): Promise<string> {
    // Check if wallet address is valid
    if (!ethers.isAddress(walletAddress)) {
      throw new BadRequestException(
        ErrorTypes.INVALID_WALLET_ADDRESS,
        'Invalid wallet address',
      );
    }

    // Generate a random nonce
    const nonce = nanoid();

    // Check if user exists with this wallet address
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });

    if (user) {
      // Update the nonce for existing user
      await this.userRepository.update(user.id, { nonce });
      return nonce;
    }

    // Return nonce for new user
    return nonce;
  }

  /**
   * Verify a signature against a wallet address and nonce
   * @param walletAddress The wallet address that signed the message
   * @param signature The signature to verify
   * @param nonce The nonce that was signed
   * @returns True if the signature is valid, false otherwise
   */
  verifySignature(
    walletAddress: string,
    signature: string,
    nonce: string,
  ): boolean {
    try {
      // The message that was signed is the nonce
      const message = `Sign this message to authenticate with your wallet: ${nonce}`;

      // Recover the address from the signature
      const recoveredAddress = ethers.verifyMessage(message, signature);

      // Check if the recovered address matches the wallet address
      return recoveredAddress.toLowerCase() === walletAddress.toLowerCase();
    } catch (error) {
      return false;
    }
  }

  /**
   * Login a user with Metamask
   * @param metamaskLoginDto The login data
   * @returns The user data with access token
   */
  async loginWithMetamask(metamaskLoginDto: MetamaskLoginDto) {
    const { walletAddress, signature } = metamaskLoginDto;

    // Check if wallet address is valid
    if (!ethers.isAddress(walletAddress)) {
      throw new BadRequestException(
        ErrorTypes.INVALID_WALLET_ADDRESS,
        'Invalid wallet address',
      );
    }

    // Find user by wallet address
    const user = await this.userRepository.findOne({
      where: { walletAddress },
    });

    if (!user) {
      throw new NotFoundException(
        ErrorTypes.USER_NOT_FOUND,
        'User not found with this wallet address',
      );
    }

    // Check if email is verified
    if (!user.emailConfirmed) {
      const userPayload = {
        id: user.id,
        email: user.email,
      };

      throw new UnauthorizedException(
        { message: ErrorTypes.MUST_VERIFY_EMAIL, user: userPayload },
        'Email must be verified',
      );
    }

    // Verify the signature
    const isValid = this.verifySignature(walletAddress, signature, user.nonce);

    if (!isValid) {
      throw new UnauthorizedException(
        ErrorTypes.INVALID_SIGNATURE,
        'Invalid signature',
      );
    }

    // Generate a new nonce for the user
    user.nonce = nanoid();
    await user.save();

    // Set access tokens
    const tokens = await this.authService.setAccessTokens({
      id: user.id,
    });

    return {
      user,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Register a new user with Metamask
   * @param metamaskRegisterDto The registration data
   * @returns The registered user data with access token
   */
  async registerWithMetamask(metamaskRegisterDto: MetamaskRegisterDto) {
    const { fullName, email, walletAddress } = metamaskRegisterDto;

    // Check if wallet address is valid
    if (!ethers.isAddress(walletAddress)) {
      throw new BadRequestException(
        ErrorTypes.INVALID_WALLET_ADDRESS,
        'Invalid wallet address',
      );
    }

    // Check if user already exists with this wallet address
    const existingUserByWallet = await this.userRepository.findOne({
      where: { walletAddress },
    });

    if (existingUserByWallet) {
      throw new BadRequestException(
        ErrorTypes.WALLET_ADDRESS_ALREADY_EXISTS,
        'User already exists with this wallet address',
      );
    }

    // Check if user already exists with this email
    const existingUserByEmail = await this.userRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new BadRequestException(
        ErrorTypes.EMAIL_ALREADY_EXISTS,
        'User already exists with this email',
      );
    }

    // Generate a temporary username based on the wallet address
    // User will set their actual username during email verification
    const tempUserName = `user_${walletAddress.substring(2, 10)}`;

    // Generate a nonce for the user
    const nonce = nanoid();

    // Create the user
    const newUser = this.userRepository.create({
      fullName,
      userName: tempUserName,
      email,
      walletAddress,
      nonce,
      userRoleCode: 'NORMAL',
    });

    const user = await this.userRepository.save(newUser);

    // Set mail verification token and get the token
    const userWithToken = await this.authService.setMailVerificationToken(user);

    // Send verification email
    await this.authService.sendAccountVerificationMail(userWithToken);

    // Return the user without access tokens
    return user;
  }
}
