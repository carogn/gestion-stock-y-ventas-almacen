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

type ItemVenta = {
  productoId: number;
  nombre: string;
  precioUnitario: number;
  cantidad: number;
  subtotal: number;
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
  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);
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

  // Agrego un producto al detalle de la venta
  const agregarItemVenta = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const producto = productos.find(
      (producto) => producto.id === Number(productoVentaId)
    );

    const cantidad = Number(cantidadVenta);

    if (!producto) {
      setMensajeVenta("Seleccioná un producto");
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setMensajeVenta("La cantidad debe ser un número entero mayor a 0");
      return;
    }

    if (cantidad > producto.stock) {
      setMensajeVenta(`Stock insuficiente para ${producto.nombre}`);
      return;
    }

    // Por ahora no permito repetir el mismo producto
    const productoYaAgregado = itemsVenta.some(
      (item) => item.productoId === producto.id
    );

    if (productoYaAgregado) {
      setMensajeVenta("Ese producto ya fue agregado a la venta");
      return;
    }

    const precioUnitario = Number(producto.precio);
    const subtotal = precioUnitario * cantidad;

    const nuevoItem: ItemVenta = {
      productoId: producto.id,
      nombre: producto.nombre,
      precioUnitario,
      cantidad,
      subtotal,
    };

    setItemsVenta([...itemsVenta, nuevoItem]);

    setProductoVentaId("");
    setCantidadVenta("");
    setMensajeVenta("");
  };

  const modificarCantidadItem = (
    productoId: number,
    valor: string
  ) => {
    const nuevaCantidad = Number(valor);

    if (valor === "") {
      setItemsVenta(
        itemsVenta.map((item) =>
          item.productoId === productoId
            ? {
                ...item,
                cantidad: 0,
                subtotal: 0,
              }
            : item
        )
      );

      return;
    }

    if (!Number.isInteger(nuevaCantidad) || nuevaCantidad <= 0) {
      return;
    }

    const producto = productos.find(
      (producto) => producto.id === productoId
    );

    if (!producto) {
      return;
    }

    if (nuevaCantidad > producto.stock) {
      setMensajeVenta(`Stock insuficiente para ${producto.nombre}`);
      return;
    }

    setItemsVenta(
      itemsVenta.map((item) =>
        item.productoId === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal: item.precioUnitario * nuevaCantidad,
            }
          : item
      )
    );

    setMensajeVenta("");
  };

  // Quito un producto del detalle antes de confirmar
  const quitarItemVenta = (productoId: number) => {
    setItemsVenta(
      itemsVenta.filter((item) => item.productoId !== productoId)
    );
  };


  // Registro la venta completa
  const crearVenta = async () => {
    if (itemsVenta.length === 0) {
      setMensajeVenta("La venta debe contener al menos un producto");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/ventas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          items: itemsVenta.map((item) => ({
            productoId: item.productoId,
            cantidad: item.cantidad,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMensajeVenta(data.message || "No se pudo registrar la venta");
        return;
      }

      setMensajeVenta("Venta registrada correctamente");

      // Limpio la venta actual
      setItemsVenta([]);
      setProductoVentaId("");
      setCantidadVenta("");

      // Actualizo los stocks mostrados
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

        <form onSubmit={agregarItemVenta}>
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
                    {producto.nombre} - ${producto.precio} - Stock: {producto.stock}
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
              step="1"
              required
            />
          </div>

          <button type="submit">Agregar producto</button>
        </form>

        {itemsVenta.length > 0 && (
          <div>
            <h3>Detalle de venta</h3>

            <ul>
              {itemsVenta.map((item) => (
                <li key={item.productoId}>
                  {item.nombre}
                  {" - "}
                  Cantidad:
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={item.cantidad}
                    onChange={(event) =>
                      modificarCantidadItem(
                        item.productoId,
                        event.target.value
                      )
                    }
                  />

                  {" x $"}

                  {item.precioUnitario.toFixed(2)}

                  {" - "}

                  Subtotal: ${item.subtotal.toFixed(2)}

                  <button
                    type="button"
                    onClick={() => quitarItemVenta(item.productoId)}
                  >
                    Quitar
                  </button>
                </li>
              ))}
            </ul>

            <p>
              <strong>
                Total: $
                {itemsVenta
                  .reduce((total, item) => total + item.subtotal, 0)
                  .toFixed(2)}
              </strong>
            </p>

            <button type="button" onClick={crearVenta}>
              Registrar venta
            </button>
          </div>
        )}

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