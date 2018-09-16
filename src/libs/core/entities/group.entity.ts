import { MaxLength, IsDate, IsNumber } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  JoinTable,
  ManyToMany
} from 'typeorm';

import { User } from './user.entity';

@Entity()
export class Group {
  @PrimaryGeneratedColumn('uuid')
  uuid: string = undefined;

  @Column({length: 100})
  @MaxLength(100)
  name: string = undefined;

  @Column({length: 255})
  @MaxLength(255)
  goal: string = undefined;

  @Column()
  @IsDate()
  dateTime: Date;

  @Column()
  @IsNumber()
  maxGroupSize: number = 10;

  @Column()
  @IsNumber()
  ticketCost: number;

  @Column()
  address: string;

  @ManyToOne(type => User)
  @JoinColumn()
  alpha: User;

  @ManyToMany(type => User)
  @JoinTable()
  members: User[];

  @Column()
  cancelled: boolean;
}
