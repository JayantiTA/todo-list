import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  message: string;

  @Column({ default: false })
  read: boolean;

  // @ManyToOne(() => User, (user) => user.notifications)
  // @JoinColumn({ name: 'userId' })
  // user: User;

  @Column()
  userId: number;
}
