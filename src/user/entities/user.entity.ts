import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'Users' })
export class User extends Model {
  @Column
  email: string;

  @Column
  phone: string;

  @Column
  name: string;

  @Column
  password: string;

  @Column
  salt: string;

  @Column
  birthDate: string;

  @Column
  height: number;

  @Column
  weight: number;
}
