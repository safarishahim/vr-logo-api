import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { UserMenu } from './userMenu.entity';
import { UserMenuItem } from './userMenuItem.entity';

@Injectable()
export class UserMenuItemService {
  constructor(
    @InjectRepository(UserMenuItem)
    private userMenuItemRepository: Repository<UserMenuItem>,
  ) {}

  async get(id: number): Promise<UserMenuItem> {
    return this.userMenuItemRepository.findOne({
      where: {
        id,
      },
    });
  }

  async create(userMenuItem: UserMenuItem) {
    return this.userMenuItemRepository.insert(userMenuItem);
  }

  async delete(id: UserMenuItem['id']) {
    return this.userMenuItemRepository.delete(id);
  }

  async update(id: number, item: UserMenu) {
    return this.userMenuItemRepository.update(
      {
        id,
      },
      item,
    );
  }

  public findAll(query: PaginateQuery): Promise<Paginated<UserMenuItem>> {
    return paginate(query, this.userMenuItemRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime', 'title'],
      searchableColumns: ['id', 'title'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
    });
  }
}
