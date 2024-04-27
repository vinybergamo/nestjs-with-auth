import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CreateUsersUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async one(data: Partial<User>): Promise<User> {
    const exists = await this.userRepository.exists({
      where: { email: data.email },
    });

    if (exists) {
      throw new BadRequestException('User already exists', 'ALREADY_EXISTS');
    }

    const user = this.userRepository.create(data);
    user.password = data.password;
    return this.userRepository.save(user);
  }
}
