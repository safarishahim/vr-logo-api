import { Injectable } from '@nestjs/common';
import { Repository, DeleteResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { GalleryItem } from './GalleryItem.entity';

@Injectable()
export class GalleryItemService {
  constructor(
    @InjectRepository(GalleryItem)
    private galleryItemRepository: Repository<GalleryItem>,
  ) {}

  async create(item: GalleryItem) {
    return this.galleryItemRepository.insert(item);
  }

  async delete(id: GalleryItem['id']): Promise<DeleteResult> {
    return this.galleryItemRepository.delete(id);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<GalleryItem>> {
    return paginate(query, this.galleryItemRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime'],
      searchableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
    });
  }

  async get(id: number): Promise<GalleryItem> {
    return this.galleryItemRepository.findOne({
      where: {
        id,
      },
      relations: {
        userFile: true,
      },
      loadRelationIds: {
        relations: ['gallery'],
        disableMixedMap: true,
      },
    });
  }

  async update(id: number, item: GalleryItem) {
    return this.galleryItemRepository.update(
      {
        id,
      },
      item,
    );
  }
}
