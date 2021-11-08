import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client4 } from 'mattermost-redux/client';
import { IsNull, Repository } from 'typeorm';
import { UserProfile } from 'mattermost-redux/types/users';
import { Team } from 'mattermost-redux/types/teams';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { Channel } from 'mattermost-redux/types/channels';
import { fetchOrProduceNull } from '../../helpers/utils';

const {
  MM_SERVER_URL = '',
  MM_SYS_ADMIN_USERNAME = '',
  MM_SYS_ADMIN_EMAIL = '',
  MM_SYS_ADMIN_PASSWORD = '',
  MM_BOT_USERNAME = '',

  REACT_APP_MM_TEAM_NAME = '',
} = process.env;
@Injectable()
export class MattermostService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  public mattermostClient: typeof Client4;

  public octopusAppTeam: Team | null = null;

  public octopusBroadcastChannel: Channel | null;

  private readonly OCTOPUS_APP_BROADCAST_CHANNEL_NAME =
    'octopus-app-broadcaster';

  async onModuleInit() {
    this.mattermostClient = Client4;

    this.mattermostClient.setUrl(MM_SERVER_URL);

    await fetchOrProduceNull(() =>
      this.mattermostClient.createUser(
        {
          username: MM_SYS_ADMIN_USERNAME,
          email: MM_SYS_ADMIN_EMAIL,
          password: MM_SYS_ADMIN_PASSWORD,
          auth_service: 'email',
        } as any,
        '',
        '',
        '',
      ),
    );

    const loginResponse = await fetchOrProduceNull(() =>
      this.mattermostClient.doFetchWithResponse<UserProfile>(
        `${this.mattermostClient.getUsersRoute()}/login`,
        {
          method: 'post',
          body: JSON.stringify({
            login_id: MM_SYS_ADMIN_EMAIL,
            password: MM_SYS_ADMIN_PASSWORD,
          }),
        },
      ),
    );

    if (!loginResponse)
      throw new Error(
        'Error initializing system admin user. Please make sure you mattermost setup is set up correctly.',
      );

    this.mattermostClient.setToken(loginResponse.headers.get('Token')!);

    const currentConfig = await this.mattermostClient.getConfig();

    if (
      !currentConfig.ServiceSettings.EnableUserAccessTokens ||
      !currentConfig.ServiceSettings.EnableBotAccountCreation
    ) {
      await this.mattermostClient.updateConfig({
        ...currentConfig,
        ServiceSettings: {
          ...currentConfig.ServiceSettings,
          EnableUserAccessTokens: true,
          EnableBotAccountCreation: true,
          AllowCorsFrom: '*',
        },
      });
    }

    const createBotResult = await fetchOrProduceNull(() =>
      this.mattermostClient.createBot({
        username: MM_BOT_USERNAME,
        description: 'Bot used to interact with octopus',
      } as any),
    );

    if (createBotResult) {
      await this.mattermostClient.updateUserRoles(
        createBotResult.user_id,
        'system_user system_admin',
      );
    }

    const botUser = await fetchOrProduceNull(() =>
      this.mattermostClient.getUserByUsername(MM_BOT_USERNAME),
    );

    if (!botUser) throw new Error('Bot user not found');

    const allTokens = await this.mattermostClient.getUserAccessTokensForUser(
      botUser.id,
    );

    for (const t of allTokens) {
      await this.mattermostClient.revokeUserAccessToken(t.id);
    }

    const token = await this.mattermostClient.createUserAccessToken(
      botUser.id,
      'Access Token used to interact with octopus',
    );

    this.mattermostClient.setToken(token.token!);

    this.octopusAppTeam = await fetchOrProduceNull(() =>
      this.mattermostClient.getTeamByName(REACT_APP_MM_TEAM_NAME),
    );

    if (!this.octopusAppTeam) {
      this.octopusAppTeam = await this.mattermostClient.createTeam({
        name: REACT_APP_MM_TEAM_NAME,
        display_name: 'Octopus App',
        type: 'O',
        description: 'The main team used to manage octopus',
      } as any);
    }

    this.octopusBroadcastChannel = await fetchOrProduceNull(() =>
      this.mattermostClient.getChannelByNameAndTeamName(
        REACT_APP_MM_TEAM_NAME,
        this.OCTOPUS_APP_BROADCAST_CHANNEL_NAME,
      ),
    );

    if (!this.octopusBroadcastChannel && this.octopusAppTeam) {
      this.octopusBroadcastChannel = await this.mattermostClient.createChannel({
        team_id: this.octopusAppTeam.id,
        name: this.OCTOPUS_APP_BROADCAST_CHANNEL_NAME,
        type: 'O',
        display_name: 'Octopus App Broadcaster',
        purpose:
          'This is the channel used to broadcast events to the front end of octopus',
      } as any);
    }

    await this.setMattermostUsers();
  }

  async setMattermostUsers() {
    const unaddedUsers = await this.userRepository.find({
      where: { emailConfirmed: true, mattermostId: IsNull() },
    });

    for (const user of unaddedUsers) {
      const userProfile = await this.mattermostClient.createUser(
        {
          email: user.email,
          username: user.userName,
          first_name: user.firstName,
          last_name: user.lastName,
          auth_service: 'google',
        } as any,
        '',
        '',
        '',
      );
      await this.mattermostClient.addUsersToTeam(this.octopusAppTeam!.id, [
        userProfile.id,
      ]);
      await this.mattermostClient.addToChannel(
        userProfile.id,
        this.octopusBroadcastChannel!.id,
      );

      await this.userRepository.update(
        { id: user.id },
        { mattermostId: userProfile.id },
      );
    }
  }

  async broadcastPost(post: Record<string, any>) {
    return this.mattermostClient.createPost({
      message: 'OCTOPUS_BROADCAST',
      props: post,
      channel_id: this.octopusBroadcastChannel!.id,
    } as any);
  }
}
