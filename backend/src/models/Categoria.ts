import { DataTypes, Model } from "sequelize";
import database from "../config/database";

// Modelo de categoría
class Categoria extends Model {
  public id!: number;
  public nombre!: string;
  public activo!: boolean;
}

// Definición de la tabla categorias
Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: database,
    modelName: "Categoria",
    tableName: "categorias",
    timestamps: true,
  }
);

export default Categoria;