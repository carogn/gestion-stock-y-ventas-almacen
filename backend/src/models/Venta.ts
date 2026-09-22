import { DataTypes, Model } from "sequelize";
import database from "../config/database";

class Venta extends Model {
  public id!: number;
  public fecha!: Date;
  public total!: number;
}

// Datos generales de una venta
Venta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "Venta",
    tableName: "ventas",
    timestamps: true,
  }
);

export default Venta;