import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  // FindManyOptions,
} from 'typeorm';

export abstract class RecordEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn({ nullable: true })
  updatedOn: Date;
}
