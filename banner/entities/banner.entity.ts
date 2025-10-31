import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity()
export class banner {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  url: string;
  @Column()
  name: string;
  @Column()
  sort: number;
  @Column()
  status: number;
}
