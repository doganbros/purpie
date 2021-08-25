import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Meeting } from './Meeting.entity';
import { User } from './User.entity';

@Entity()
export class MeetingAttendance extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  meetingSlug: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Meeting, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'meetingSlug', referencedColumnName: 'slug' })
  meeting: Meeting;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  endDate: Date;
}
