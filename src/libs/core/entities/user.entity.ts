import {
  IsPhoneNumber,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  validateSync,
} from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CustomValidationError } from '../exceptions/custom-validation.error';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  uuid: string = undefined;

  @Column({ length: 128 })
  @MaxLength(128)
  @IsOptional()
  password: string = undefined;

  @Column({ name: 'first_name', length: 30 })
  @MaxLength(30)
  @IsOptional()
  firstName: string = undefined;

  @Column({ name: 'last_name', length: 30 })
  @MaxLength(30)
  @IsOptional()
  lastName: string = undefined;

  @Column({ length: 12 })
  @MaxLength(12)
  @IsPhoneNumber('RU')
  phone: string = undefined;

  @BeforeInsert()
  doBeforeInsertion() {
    const errors = validateSync(this, { validationError: { target: false } });
    if (errors.length > 0) {
      throw new CustomValidationError(errors);
    }
  }

  @BeforeUpdate()
  doBeforeUpdate() {
    const errors = validateSync(this, { validationError: { target: false } });
    if (errors.length > 0) {
      throw new CustomValidationError(errors);
    }
  }

  async createPassword(password: string) {
    const hash = await bcrypt.hash(password, 8);

    return hash;
  }

  async validatePassword(password: string) {
    return await bcrypt.compare(password, this.password);
  }

  async setPassword(password: string) {
    if (password) {
      this.password = await this.createPassword(password);
    }
    return this;
  }
}
