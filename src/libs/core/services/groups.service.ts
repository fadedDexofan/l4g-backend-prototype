import {
  Inject,
  Injectable,
  MethodNotAllowedException,
  NotFoundException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Group) private readonly groupRepository: Repository<Group>
  ) {}

  async create(options: { item: Group }) {
    try {
      options.item = await this.groupRepository.save(options.item);
      const { group } = await this.findByUuid({ uuid: options.item.uuid });
      return { group };
    } catch (error) {
      throw error;
    }
  }

  async update(options: { uuid: string; item: Group }) {
    options.item.uuid = options.uuid;
    const group = await this.groupRepository.findOneOrFail(options.uuid);
    Object.assign(group, options.item);
    const item = await this.groupRepository.save(group);
    return { group: item };
    try {
      options.item;
    } catch (error) {}
  }

  async findByUuid(options: { uuid: string }) {
    try {
      const item = await this.groupRepository.findOneOrFail(options.uuid, {
        relations: ['alpha', 'members']
      });
      return { group: item };
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const items = await this.groupRepository.find({
        relations: ['alpha', 'members']
      });
      return { groups: items };
    } catch (error) {
      throw error;
    }
  }

  async findUserGroups(options: { userUuid: string }) {
    try {
      // this.groupRepository.
      const user = await this.userRepository.findOneOrFail();
      const groups = await this.groupRepository
        .createQueryBuilder('group')
        .leftJoinAndSelect('group.alpha', 'alpha')
        .leftJoinAndSelect(
          'group.members',
          'member',
          'member.uuid = :userUuid',
          {
            userUuid: options.userUuid
          }
        )
        // .groupBy('group.uuid')
        .getMany();

      return { groups };
    } catch (error) {}
  }

  async addUser(options: { userUuid: string; groupUuid: string }) {
    try {
      const userItem = await this.userRepository.findOneOrFail(
        options.userUuid
      );

      const groupItem = await this.groupRepository.findOneOrFail(
        options.groupUuid,
        { relations: ['alpha', 'members'] }
      );

      await groupItem.members.push(userItem);
      const item = await this.groupRepository.save(groupItem);

      return { group: item };
    } catch (error) {
      throw error;
    }
  }

  async removeUser(options: { userUuid: string; groupUuid: string }) {
    try {
      const userItem = await this.userRepository.findOneOrFail(
        options.userUuid
      );

      const groupItem = await this.groupRepository.findOneOrFail(
        options.groupUuid,
        { relations: ['alpha', 'members'] }
      );

      const filteredMembers = groupItem.members.filter(user => {
        return user.uuid !== userItem.uuid;
      });

      groupItem.members = filteredMembers;

      const item = await this.groupRepository.save(groupItem);

      return { group: item };
    } catch (error) {
      throw error;
    }
  }
}
