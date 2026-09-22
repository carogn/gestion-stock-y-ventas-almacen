import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

type Producto = {
  id: number;
  nombre: string;
  precio: string;
  stock: number;
  stockMinimo: number;
  activo: boolean;
};

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [productoVentaId, setProductoVentaId] = useState("");
  const [cantidadVenta, setCantidadVenta] = useState("");
  const [mensajeVenta, setMensajeVenta] = useState("");

  // Traigo los productos desde el backend
  const cargarProductos = () => {
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  // Creo un producto nuevo desde el formulario
  const crearProducto = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/productos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          precio: Number(precio),
          stock: Number(stock),
          stockMinimo: Number(stockMinimo),
        }),
      });

      if (!response.ok) {
        throw new Error("No se pudo crear el producto");
      }

      // Limpio el formulario y vuelvo a consultar la lista
      setNombre("");
      setPrecio("");
      setStock("");
      setStockMinimo("");

      cargarProductos();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  // Registro una venta usando el endpoint del backend
  const crearVenta = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productoId: Number(productoVentaId),
          cantidad: Number(cantidadVenta),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeVenta(data.message || "No se pudo registrar la venta");
        return;
      }

      setMensajeVenta("Venta registrada correctamente");
      setProductoVentaId("");
      setCantidadVenta("");

      cargarProductos();
    } catch (error) {
      console.error("Error al registrar venta:", error);
      setMensajeVenta("Error al registrar la venta");
    }
  };

  return (
    <main>
      <h1>Gestión de stock y ventas</h1>

      <section>
        <h2>Nuevo producto</h2>

        <form onSubmit={crearProducto}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              value={precio}
              onChange={(event) => setPrecio(event.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Stock</label>
            <input
              type="number"
              value={stock}
              onChange={(event) => setStock(event.target.value)}
              min="0"
              required
            />
          </div>

          <div>
            <label>Stock mínimo</label>
            <input
              type="number"
              value={stockMinimo}
              onChange={(event) => setStockMinimo(event.target.value)}
              min="0"
              required
            />
          </div>

          <button type="submit">Crear producto</button>
        </form>
      </section>

      <section>

        <h2>Nueva venta</h2>

          <form onSubmit={crearVenta}>
            <div>
              <label>Producto</label>

              <select
                value={productoVentaId}
                onChange={(event) => setProductoVentaId(event.target.value)}
                required
              >
                <option value="">Seleccionar producto</option>

                {productos.map((producto) => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre} - Stock: {producto.stock}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Cantidad</label>

              <input
                type="number"
                value={cantidadVenta}
                onChange={(event) => setCantidadVenta(event.target.value)}
                min="1"
                required
              />
            </div>

            <button type="submit">Registrar venta</button>
          </form>

          {mensajeVenta && <p>{mensajeVenta}</p>}
      </section>

      <section>
        <h2>Productos</h2>

        {productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          <ul>
            {productos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}

export default App;