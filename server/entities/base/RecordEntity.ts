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

  // static async paginate(options?: FindManyOptions<BaseEntity>) {
  //   const [data, total] = await BaseEntity.findAndCount(options);

  //   return {
  //     data,
  //     total,
  //     limit: options?.take,
  //     skip: options?.skip,
  //   };
  // }
}
