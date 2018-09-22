import { MaxLength, validateSync, IsMobilePhone } from 'class-validator';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  BeforeInsert,
  BeforeUpdate
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { CustomValidationError } from '../exceptions/custom-validation.error';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string = undefined;

  @Column({ length: 128 })
  @MaxLength(128)
  password: string = undefined;

  @Column({ name: 'first_name', length: 30 })
  @MaxLength(30)
  firstName: string = undefined;

  @Column({ name: 'last_name', length: 30 })
  @MaxLength(30)
  lastName: string = undefined;

  @Column({ length: 12 })
  @MaxLength(12)
  @IsMobilePhone('ru-RU')
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
    return bcrypt.compare(password, this.password);
  }

  async setPassword(password: string) {
    if (password) {
      this.password = await this.createPassword(password);
    }
    return this;
  }
}
