import { Entity, Column, ManyToMany, OneToMany } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';
import { UserChannel } from './UserChannel.entity';
import { Zone } from './Zone.entity';
import { UserZone } from './UserZone.entity';

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

  @ManyToMany(() => Zone, (zone) => zone.users)
  zones: Array<Zone>;

  @OneToMany(() => UserZone, (userZone) => userZone.zone)
  userZone: Array<UserZone>;

  @OneToMany(() => UserChannel, (userChannel) => userChannel.user)
  userChannel: Array<UserChannel>;
}
