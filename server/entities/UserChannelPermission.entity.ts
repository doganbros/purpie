import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class UserChannelPermission extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  canAddUser: boolean;

  @Column()
  canContribute: boolean;
}
