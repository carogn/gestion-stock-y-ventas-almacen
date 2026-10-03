import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

type Categoria = {
  id: number;
  nombre: string;
  activo: boolean;
};

type Producto = {
  id: number;
  nombre: string;
  precio: string;
  stock: number;
  stockMinimo: number;
  activo: boolean;
  categoriaId: number | null;
  categoria?: Categoria | null;
};

function App() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [productoVentaId, setProductoVentaId] = useState("");
  const [cantidadVenta, setCantidadVenta] = useState("");
  const [mensajeVenta, setMensajeVenta] = useState("");
  const [categoriaId, setCategoriaId] = useState("");
  const [productoEditandoId, setProductoEditandoId] = useState<number | null>(null);
  const [nombreEdit, setNombreEdit] = useState("");
  const [precioEdit, setPrecioEdit] = useState("");
  const [stockMinimoEdit, setStockMinimoEdit] = useState("");
  const [categoriaEditId, setCategoriaEditId] = useState("");
  const [productoReposicionId, setProductoReposicionId] = useState<number | null>(null);
  const [cantidadReposicion, setCantidadReposicion] = useState("");
  const [mensajeReposicion, setMensajeReposicion] = useState("");

  // Traigo los productos desde el backend
  const cargarProductos = () => {
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) => console.error("Error al cargar productos:", error));
  };

  useEffect(() => {
  cargarProductos();
  cargarCategorias();
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
          categoriaId: Number(categoriaId),
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
      setCategoriaId("");

      cargarProductos();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  // Traigo las categorías desde el backend
  const cargarCategorias = () => {
    fetch("http://localhost:3000/categorias")
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) =>
        console.error("Error al cargar categorías:", error)
      );
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

  // Cargo los datos del producto que quiero editar
  const seleccionarProductoParaEditar = (producto: Producto) => {
    setProductoEditandoId(producto.id);
    setNombreEdit(producto.nombre);
    setPrecioEdit(producto.precio);
    setStockMinimoEdit(String(producto.stockMinimo));
    setCategoriaEditId(
      producto.categoriaId !== null ? String(producto.categoriaId) : ""
    );
  };

  // Actualizo los datos del producto seleccionado
  const editarProducto = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (productoEditandoId === null) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/productos/${productoEditandoId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: nombreEdit,
            precio: Number(precioEdit),
            stockMinimo: Number(stockMinimoEdit),
            categoriaId: Number(categoriaEditId),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo editar el producto");
      }

      setProductoEditandoId(null);
      setNombreEdit("");
      setPrecioEdit("");
      setStockMinimoEdit("");
      setCategoriaEditId("");

      cargarProductos();
    } catch (error) {
      console.error("Error al editar producto:", error);
    }
  };

  const desactivarProducto = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:3000/productos/${id}/desactivar`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "No se pudo desactivar el producto");
        return;
      }

      cargarProductos();
    } catch (error) {
      console.error("Error al desactivar producto:", error);
    }
  };

  const reponerStock = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (productoReposicionId === null) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/productos/${productoReposicionId}/reponer`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cantidad: Number(cantidadReposicion),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensajeReposicion(
          data.message || "No se pudo reponer el stock"
        );
        return;
      }

      setMensajeReposicion("Stock repuesto correctamente");
      setCantidadReposicion("");
      setProductoReposicionId(null);

      cargarProductos();
    } catch (error) {
      console.error("Error al reponer stock:", error);
      setMensajeReposicion("Error al reponer el stock");
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

          <div>
            <label>Categoría</label>

            <select
              value={categoriaId}
              onChange={(event) => setCategoriaId(event.target.value)}
              required
            >
              <option value="">Seleccionar categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
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

                {productos
                  .filter((producto) => producto.activo)
                  .map((producto) => (
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

      {productoReposicionId !== null && (
        <section>
          <h2>Reponer stock</h2>

          <form onSubmit={reponerStock}>
            <div>
              <label>Cantidad</label>
              <input
                type="number"
                value={cantidadReposicion}
                onChange={(event) => setCantidadReposicion(event.target.value)}
                min="1"
                step="1"
                required
              />
            </div>

            <button type="submit">
              Confirmar reposición
            </button>

            <button
              type="button"
              onClick={() => {
                setProductoReposicionId(null);
                setCantidadReposicion("");
                setMensajeReposicion("");
              }}
            >
              Cancelar
            </button>
          </form>

          {mensajeReposicion && <p>{mensajeReposicion}</p>}
        </section>
      )}

      <section>
        <h2>Productos</h2>

        {productos.length === 0 ? (
          <p>No hay productos cargados.</p>
        ) : (
          <ul>
            {productos.map((producto) => (
              <li key={producto.id}>
                {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
                {" - "}
                Categoría: {producto.categoria?.nombre ?? "Sin categoría"}
                {" - "}
                Estado: {producto.activo ? "Activo" : "Inactivo"}

                <button
                  type="button"
                  onClick={() => seleccionarProductoParaEditar(producto)}
                >
                  Editar
                </button>

                {producto.activo && (
                  <button
                    type="button"
                    onClick={() => desactivarProducto(producto.id)}
                  >
                    Desactivar
                  </button> 

                )}

                  <button
                    type="button"
                    onClick={() => {
                      setProductoReposicionId(producto.id);
                      setCantidadReposicion("");
                      setMensajeReposicion("");
                    }}
                  >
                    Reponer stock
                  </button>

              </li>
            ))}
          </ul>
        )}
      </section>

      {productoEditandoId !== null && (
      <section>
        <h2>Editar producto</h2>

        <form onSubmit={editarProducto}>
          <div>
            <label>Nombre</label>
            <input
              type="text"
              value={nombreEdit}
              onChange={(event) => setNombreEdit(event.target.value)}
              required
            />
          </div>

          <div>
            <label>Precio</label>
            <input
              type="number"
              value={precioEdit}
              onChange={(event) => setPrecioEdit(event.target.value)}
              min="0"
              step="0.01"
              required
            />
          </div>

          <div>
            <label>Stock mínimo</label>
            <input
              type="number"
              value={stockMinimoEdit}
              onChange={(event) => setStockMinimoEdit(event.target.value)}
              min="0"
              required
            />
          </div>

          <div>
            <label>Categoría</label>
            <select
              value={categoriaEditId}
              onChange={(event) => setCategoriaEditId(event.target.value)}
              required
            >
              <option value="">Seleccionar categoría</option>

              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>

          <button type="submit">Guardar cambios</button>

          <button
            type="button"
            onClick={() => setProductoEditandoId(null)}
          >
            Cancelar
          </button>
        </form>
      </section>
    )}
    </main>
  );
}

export default App;