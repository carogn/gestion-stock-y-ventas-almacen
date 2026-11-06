import { DataTypes, Model } from "sequelize";
import database from "../config/database";

class Usuario extends Model {
  public id!: number;
  public nombre!: string;
  public email!: string;
  public passwordHash!: string;
  public activo!: boolean;
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "password_hash",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: database,
    modelName: "Usuario",
    tableName: "usuarios",
    timestamps: true,
  }
);

export default Usuario;