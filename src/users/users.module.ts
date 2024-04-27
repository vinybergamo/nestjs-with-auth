import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entites/user.entity';
import { UsersService } from './users.service';
import { CreateUsersUseCase } from './usecases/create.usecase';
import { FindUsersUseCase } from './usecases/find.usecase';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, CreateUsersUseCase, FindUsersUseCase],
  exports: [UsersService],
})
export class UsersModule {}
