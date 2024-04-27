import { Exclude, Expose } from 'class-transformer';
import { BaseEntity } from 'src/common/entities/base-entity';
import { Column, Entity } from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

@Entity()
export class User extends BaseEntity {
  @Column()
  name: string;

  @Column()
  email: string;

  @Column({
    name: 'password',
  })
  _password: string;

  @Exclude()
  get password(): string {
    return this._password;
  }

  set password(password: string) {
    const salt = genSaltSync(10);
    this._password = hashSync(password, salt);
  }
}
