import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { paginate, Paginated, PaginateQuery } from "nestjs-paginate";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {
  }

  async create(user: User) {
    return this.userRepository.insert(user);
  }


  async delete(userId: User["id"]) {
    return this.userRepository.delete(userId);
  }

  public findAll(query: PaginateQuery): Promise<Paginated<User>> {
    return paginate(query, this.userRepository, {
      sortableColumns: ["id", "createDateTime", "updateDateTime", "status"],
      searchableColumns: ["firstName", "lastName", "email"],
      defaultSortBy: [["id", "DESC"]],
      select: ["id", "firstName", "lastName", "email", "status", "createDateTime", "updateDateTime"],
      defaultLimit: 20
    });
  }

  async getById(id: number): Promise<User> {
    return this.userRepository.findOneBy({
      id
    });
  }

  async getByEmail(email: string): Promise<User> {
    return this.userRepository.findOneBy({
      email
    });
  }

  async update(id: number, user: User) {
    return this.userRepository.update(
      {
        id
      },
      user
    );
  }
}
