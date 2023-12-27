import { Column, Entity } from 'typeorm';
import { RecordEntity } from './base/RecordEntity';

@Entity()
export class BlacklistName extends RecordEntity {
  @Column()
  text: string;

  @Column()
  type: string;
}
