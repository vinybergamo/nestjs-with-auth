import { Injectable } from '@nestjs/common';
import { CreateUsersUseCase } from './usecases/create.usecase';
import { FindUsersUseCase } from './usecases/find.usecase';

@Injectable()
export class UsersService {
  constructor(
    private readonly createUsersUseCase: CreateUsersUseCase,
    private readonly findUsersUseCase: FindUsersUseCase,
  ) {}

  get create() {
    return this.createUsersUseCase;
  }

  get find() {
    return this.findUsersUseCase;
  }
}
