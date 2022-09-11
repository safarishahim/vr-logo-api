import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate, Paginated, PaginateQuery } from 'nestjs-paginate';
import { Gallery } from './Gallery.entity';

@Injectable()
export class GalleryService {
  constructor(
    @InjectRepository(Gallery)
    private galleryRepository: Repository<Gallery>,
  ) {}

  async create(gallery: Gallery) {
    return this.galleryRepository.insert(gallery);
  }

  async delete(galleryId: Gallery['id']) {
    return this.galleryRepository.delete(galleryId);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<Gallery>> {
    return paginate(query, this.galleryRepository, {
      sortableColumns: ['id', 'createDateTime', 'updateDateTime'],
      searchableColumns: ['id'],
      defaultSortBy: [['id', 'DESC']],
      defaultLimit: 20,
    });
  }

  async getById(id: number): Promise<Gallery> {
    return this.galleryRepository.findOne({
      where: {
        id,
      },
      loadRelationIds: {
        relations: ['userMenu'],
        disableMixedMap: true,
      },
    });
  }

  async update(id: number, gallery: Gallery) {
    return this.galleryRepository.update(
      {
        id,
      },
      gallery,
    );
  }
}
