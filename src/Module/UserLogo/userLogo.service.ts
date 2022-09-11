import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UserLogo } from './userLogo.entity';

@Injectable()
export class UserLogoService {
  constructor(
    @InjectRepository(UserLogo)
    private userLogoRepository: Repository<UserLogo>,
  ) {}

  async create(userLogo: UserLogo) {
    return this.userLogoRepository.insert(userLogo);
  }

  async delete(userLogoId: UserLogo['id']) {
    return this.userLogoRepository.delete(userLogoId);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<UserLogo>> {
    return paginate(query, this.userLogoRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime', 'title'],
      searchableColumns: ['id', 'title'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
      relations: ['userFile'],
    });
  }

  async getById(id: number): Promise<UserLogo> {
    return this.userLogoRepository.findOne({
      where: {
        id,
      },
      relations: ['userFile'],
      loadRelationIds: {
        relations: ['user', 'userMenu'],
        disableMixedMap: true,
      },
    });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.userLogoRepository.delete(id);
  }

  async update(id: number, user: UserLogo) {
    return this.userLogoRepository.update(
      {
        id,
      },
      user,
    );
  }
}
