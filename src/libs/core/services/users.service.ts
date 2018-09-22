import {
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>
  ) {}

  async create(options: { item: User }) {
    try {
      options.item = await this.repository.save(options.item);
      const { user } = await this.findByUuid({ uuid: options.item.uuid });
      return { user };
    } catch (error) {
      return error;
    }
  }

  async update(options: { uuid: string; item: User }) {
    try {
      const { user: oldUser } = await this.findByUuid({ uuid: options.uuid });
      oldUser.firstName = options.item.firstName;
      oldUser.lastName = options.item.lastName;
      const user = await this.repository.save(oldUser);
      return { user };
    } catch (error) {
      throw error;
    }
  }

  async findByUuid(options: { uuid: string }) {
    try {
      const item = await this.repository.findOneOrFail(options.uuid);
      return { user: item };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const items = await this.repository.find();
      return { users: items };
    } catch (error) {
      throw error;
    }
  }
}
