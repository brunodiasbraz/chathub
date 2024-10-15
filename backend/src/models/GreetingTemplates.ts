import {
  Table,
  Column,
  CreatedAt,
  UpdatedAt,
  Model,
  PrimaryKey,
  AutoIncrement
} from "sequelize-typescript";

@Table
class Greeting_Template extends Model<Greeting_Template> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  template: string;

  @Column
  status: number;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Greeting_Template;
