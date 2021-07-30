import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Category extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  parentCategoryId: number;

  @ManyToOne(() => Category, { nullable: true })
  @JoinColumn({ name: 'parentCategoryId' })
  parentCategory: Category;
}
