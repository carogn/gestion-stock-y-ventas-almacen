import { DataTypes, Model } from "sequelize";
import database from "../config/database";

// Modelo de producto
class Producto extends Model {
  public id!: number;
  public nombre!: string;
  public precio!: number;
  public stock!: number;
  public stockMinimo!: number;
  public activo!: boolean;
}

// Definición de la tabla productos
Producto.init(
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
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stockMinimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: "stock_minimo",
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize: database,
    modelName: "Producto",
    tableName: "productos",
    timestamps: true,
  }
);

export default Producto;