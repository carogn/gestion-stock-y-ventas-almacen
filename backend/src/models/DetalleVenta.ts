import { DataTypes, Model } from "sequelize";
import database from "../config/database";

class DetalleVenta extends Model {
  public id!: number;
  public ventaId!: number;
  public productoId!: number;
  public cantidad!: number;
  public precioUnitario!: number;
  public subtotal!: number;
}

// Cada registro representa un producto incluido en una venta
DetalleVenta.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ventaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "venta_id",
    },
    productoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "producto_id",
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    precioUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "precio_unitario",
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
  },
  {
    sequelize: database,
    modelName: "DetalleVenta",
    tableName: "detalles_venta",
    timestamps: true,
  }
);

export default DetalleVenta;