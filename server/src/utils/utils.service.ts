import { Injectable, OnModuleInit } from '@nestjs/common';
import { Client4 } from 'mattermost-redux/client';
import { IsNull, Repository } from 'typeorm';
import { Team } from 'mattermost-redux/types/teams';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'entities/User.entity';
import { Channel } from 'mattermost-redux/types/channels';
import { fetchOrProduceNull } from '../../helpers/utils';

const {
  MM_SERVER_URL = '',
  MM_BOT_TOKEN = '',
  REACT_APP_MM_TEAM_NAME = '',
} = process.env;
@Injectable()
export class UtilsService implements OnModuleInit {
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
    this.mattermostClient.setToken(MM_BOT_TOKEN);

    await this.mattermostClient.ping();

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
