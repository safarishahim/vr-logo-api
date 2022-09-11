import { Injectable } from '@nestjs/common';
import { User } from '../user.entity';

@Injectable()
export class UserFactory {
  prepareUserInfo(user: User): Partial<User> {
    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      createDateTime: user.createDateTime,
      updateDateTime: user.updateDateTime,
    };
  }
}
