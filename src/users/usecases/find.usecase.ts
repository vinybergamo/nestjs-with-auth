import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entites/user.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class FindUsersUseCase {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async all(): Promise<User[]> {
    return this.userRepository.find();
  }

  async byId(id: string): Promise<User> {
    return this.findOneWhere({
      id,
    });
  }

  async byEmail(email: string): Promise<User> {
    return this.findOneWhere({ email });
  }

  private findOneWhere(where: FindOptionsWhere<User>) {
    return this.userRepository.findOne({ where });
  }
}
