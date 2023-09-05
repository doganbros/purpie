import {
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { MeetingConfig } from 'types/Meeting';
import { UserRoleCode } from 'types/RoleCodes';
import { PostSettings } from 'types/PostSettings';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { Zone } from './Zone.entity';
import { UserZone } from './UserZone.entity';
import { UserRole } from './UserRole.entity';
import { Contact } from './Contact.entity';
import { baseMeetingConfig } from './data/base-meeting-config';
import { defaultPostSettings } from './data/default-post-settings';
import { defaultPrivacyConfig } from './data/default-privacy-config';

@Entity()
export class User extends RecordEntity {
  @Column()
  @ApiProperty()
  fullName: string;

  @Column()
  @ApiProperty()
  userName: string;

  @Column({ unique: true })
  @ApiProperty()
  email: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  displayPhoto: string | null;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true })
  mailVerificationToken: string;

  @Column({
    type: 'simple-json',
    default: {
      jitsiConfig: baseMeetingConfig,
      privacyConfig: defaultPrivacyConfig,
    } as MeetingConfig,
  })
  userMeetingConfig: MeetingConfig;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'userRoleCode', referencedColumnName: 'roleCode' })
  @ApiProperty()
  userRole: UserRole;

  @Column()
  userRoleCode: UserRoleCode;

  @ManyToMany(() => Zone, (zone) => zone.users)
  zones: Array<Zone>;

  @OneToMany(() => UserZone, (userZone) => userZone.user)
  userZone: Array<UserZone>;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
  userChannel: Array<UserChannel>;

  @OneToMany(() => Contact, (contact) => contact.contactUserId)
  contacts: Array<Contact>;

  @Column('tsvector', { select: false })
  search_document: any;

  @Column({ type: 'simple-json', select: false, default: defaultPostSettings })
  postSettings: PostSettings;

  @Column({ nullable: true })
  apiKey: string;

  @Column({ nullable: true })
  apiSecret: string;
}
