import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserFile } from './userFile.entity';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';

@Injectable()
export class UserFileService {
  constructor(
    @InjectRepository(UserFile)
    private userRepository: Repository<UserFile>,
  ) {}

  async create(user: UserFile) {
    return this.userRepository.insert(user);
  }

  async delete(userId: UserFile['id']) {
    return this.userRepository.delete(userId);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<UserFile>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime', 'fileType'],
      searchableColumns: ['id', 'fileName'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
    });
  }

  async getById(id: UserFile['id']): Promise<UserFile> {
    return this.userRepository.findOneBy({
      id,
    });
  }

  async deleteFile(id: UserFile['id']): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }

  async update(id: UserFile['id'], user: UserFile) {
    return this.userRepository.update(
      {
        id,
      },
      user,
    );
  }
}
