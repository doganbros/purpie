import {
  Entity,
  Column,
  ManyToMany,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { MeetingConfig } from 'types/Meeting';
import { UserRoleCode } from 'types/RoleCodes';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { Zone } from './Zone.entity';
import { UserZone } from './UserZone.entity';
import { UserRole } from './UserRole.entity';
import { Contact } from './Contact.entity';
import { baseMeetingConfig } from './data/base-meeting-config';

@Entity()
export class User extends RecordEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: false })
  emailConfirmed: boolean;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  googleId: string;

  @Column({ nullable: true })
  facebookId: string;

  @Column({ nullable: true })
  forgotPasswordToken: string;

  @Column({ nullable: true })
  mailVerificationToken: string;

  @Column({ type: 'simple-json', default: baseMeetingConfig })
  userMeetingConfig: MeetingConfig;

  @Column({ nullable: true, type: String })
  refreshAccessToken: string | null;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'userRoleCode', referencedColumnName: 'roleCode' })
  userRole: UserRole;

  @Column()
  userRoleCode: UserRoleCode;

  @ManyToMany(() => Zone, (zone) => zone.users)
  zones: Array<Zone>;

  @OneToMany(() => UserZone, (userZone) => userZone.zone)
  userZone: Array<UserZone>;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
  userChannel: Array<UserChannel>;

  @OneToMany(() => Contact, (contact) => contact.contactUserId)
  contacts: Array<Contact>;
}
