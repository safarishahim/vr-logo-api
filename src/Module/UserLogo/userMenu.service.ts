import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { DeleteResult } from 'typeorm/query-builder/result/DeleteResult';
import { UserMenu } from './userMenu.entity';

@Injectable()
export class UserMenuService {
  constructor(
    @InjectRepository(UserMenu)
    private userMenuRepository: Repository<UserMenu>,
  ) {}

  async create(userLogo: UserMenu) {
    return this.userMenuRepository.insert(userLogo);
  }

  async delete(userLogoId: UserMenu['id']) {
    return this.userMenuRepository.delete(userLogoId);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<UserMenu>> {
    return paginate(query, this.userMenuRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime', 'title'],
      searchableColumns: ['id', 'title'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
    });
  }

  async getById(id: number): Promise<UserMenu> {
    return this.userMenuRepository.findOne({
      where: {
        id,
      },
    });
  }

  async getByLogoId(id: number): Promise<UserMenu> {
    return this.userMenuRepository.findOne({
      where: {
        userLogo: {
          id,
        },
      },
    });
  }

  async deleteById(id: number): Promise<DeleteResult> {
    return this.userMenuRepository.delete(id);
  }

  async update(id: number, user: UserMenu) {
    return this.userMenuRepository.update(
      {
        id,
      },
      user,
    );
  }
}
