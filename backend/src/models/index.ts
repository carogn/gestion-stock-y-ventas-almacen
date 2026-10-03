import Producto from "./Producto";
import Venta from "./Venta";
import DetalleVenta from "./DetalleVenta";
import Categoria from "./Categoria";

// Una venta puede tener varios productos
Venta.hasMany(DetalleVenta, {
  foreignKey: "ventaId",
  as: "detalles",
});

DetalleVenta.belongsTo(Venta, {
  foreignKey: "ventaId",
  as: "venta",
});

// Un producto puede aparecer en muchas ventas
Producto.hasMany(DetalleVenta, {
  foreignKey: "productoId",
  as: "detallesVenta",
});

DetalleVenta.belongsTo(Producto, {
  foreignKey: "productoId",
  as: "producto",
});

// Una categoria puede tener varios productos
Categoria.hasMany(Producto, {
  foreignKey: "categoriaId",
  as: "productos",
});

Producto.belongsTo(Categoria, {
  foreignKey: "categoriaId",
  as: "categoria",
});

export { Producto, Venta, DetalleVenta, Categoria };