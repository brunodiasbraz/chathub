import {
  AllowNull,
  AutoIncrement,
  BelongsToMany,
  Column,
  CreatedAt,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
  Unique,
  UpdatedAt
} from "sequelize-typescript";

@Table
class Arquivos extends Model<Arquivos> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  arquivo: string;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;

  static associate(models: any) {
    // Definições de associações aqui
  }
}

export default Arquivos;
