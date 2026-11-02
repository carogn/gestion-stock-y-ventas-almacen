import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

import {
  Accordion,
  AppShell,
  Badge,
  Button,
  Container,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import Dashboard from "./components/Dashboard";
import Sidebar from "./components/Sidebar";
import type { Seccion } from "./components/Sidebar";

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

type DetalleVentaHistorial = {
  id: number;
  productoId: number;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
  producto: {
    id: number;
    nombre: string;
  };
};

type VentaHistorial = {
  id: number;
  fecha: string;
  total: string;
  detalles: DetalleVentaHistorial[];
};

function App() {
  const [seccionActiva, setSeccionActiva] =
    useState<Seccion>("inicio");

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");
  const [stockMinimo, setStockMinimo] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  const [productoVentaId, setProductoVentaId] = useState("");
  const [cantidadVenta, setCantidadVenta] = useState("");
  const [mensajeVenta, setMensajeVenta] = useState("");
  const [itemsVenta, setItemsVenta] = useState<ItemVenta[]>([]);

  const [productoEditandoId, setProductoEditandoId] =
    useState<number | null>(null);

  const [nombreEdit, setNombreEdit] = useState("");
  const [precioEdit, setPrecioEdit] = useState("");
  const [stockMinimoEdit, setStockMinimoEdit] = useState("");
  const [categoriaEditId, setCategoriaEditId] = useState("");

  const [productoReposicionId, setProductoReposicionId] =
    useState<number | null>(null);

  const [cantidadReposicion, setCantidadReposicion] = useState("");
  const [mensajeReposicion, setMensajeReposicion] = useState("");

  const [ventas, setVentas] = useState<VentaHistorial[]>([]);

  const [productosStockBajo, setProductosStockBajo] =
    useState<Producto[]>([]);

  const [mostrarNuevoProducto, setMostrarNuevoProducto] =
    useState(false);

  // =========================
  // CARGAS DESDE EL BACKEND
  // =========================

  const cargarProductos = () => {
    fetch("http://localhost:3000/productos")
      .then((response) => response.json())
      .then((data) => setProductos(data))
      .catch((error) =>
        console.error("Error al cargar productos:", error)
      );
  };

  const cargarCategorias = () => {
    fetch("http://localhost:3000/categorias")
      .then((response) => response.json())
      .then((data) => setCategorias(data))
      .catch((error) =>
        console.error("Error al cargar categorías:", error)
      );
  };

  const cargarVentas = () => {
    fetch("http://localhost:3000/ventas")
      .then((response) => response.json())
      .then((data) => setVentas(data))
      .catch((error) =>
        console.error("Error al cargar ventas:", error)
      );
  };

  const cargarProductosStockBajo = () => {
    fetch("http://localhost:3000/productos/stock-bajo")
      .then((response) => response.json())
      .then((data) => setProductosStockBajo(data))
      .catch((error) =>
        console.error(
          "Error al cargar productos con stock bajo:",
          error
        )
      );
  };

  useEffect(() => {
    cargarProductos();
    cargarCategorias();
    cargarVentas();
    cargarProductosStockBajo();
  }, []);

  // =========================
  // PRODUCTOS
  // =========================

  const crearProducto = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:3000/productos",
        {
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
        }
      );

      if (!response.ok) {
        throw new Error("No se pudo crear el producto");
      }

      setNombre("");
      setPrecio("");
      setStock("");
      setStockMinimo("");
      setCategoriaId("");
      setMostrarNuevoProducto(false);

      cargarProductos();
      cargarProductosStockBajo();
    } catch (error) {
      console.error("Error al crear producto:", error);
    }
  };

  const seleccionarProductoParaEditar = (
    producto: Producto
  ) => {
    setProductoEditandoId(producto.id);
    setNombreEdit(producto.nombre);
    setPrecioEdit(producto.precio);
    setStockMinimoEdit(String(producto.stockMinimo));

    setCategoriaEditId(
      producto.categoriaId !== null
        ? String(producto.categoriaId)
        : ""
    );
  };

  const editarProducto = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
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
      cargarProductosStockBajo();
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
        alert(
          data.message ||
            "No se pudo desactivar el producto"
        );
        return;
      }

      cargarProductos();
      cargarProductosStockBajo();
    } catch (error) {
      console.error(
        "Error al desactivar producto:",
        error
      );
    }
  };

  // =========================
  // VENTA
  // =========================

  const agregarItemVenta = (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const producto = productos.find(
      (producto) =>
        producto.id === Number(productoVentaId)
    );

    const cantidad = Number(cantidadVenta);

    if (!producto) {
      setMensajeVenta("Seleccioná un producto");
      return;
    }

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      setMensajeVenta(
        "La cantidad debe ser un número entero mayor a 0"
      );
      return;
    }

    if (cantidad > producto.stock) {
      setMensajeVenta(
        `Stock insuficiente para ${producto.nombre}`
      );
      return;
    }

    const productoYaAgregado = itemsVenta.some(
      (item) => item.productoId === producto.id
    );

    if (productoYaAgregado) {
      setMensajeVenta(
        "Ese producto ya fue agregado a la venta"
      );
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

    if (
      !Number.isInteger(nuevaCantidad) ||
      nuevaCantidad <= 0
    ) {
      return;
    }

    const producto = productos.find(
      (producto) => producto.id === productoId
    );

    if (!producto) {
      return;
    }

    if (nuevaCantidad > producto.stock) {
      setMensajeVenta(
        `Stock insuficiente para ${producto.nombre}`
      );
      return;
    }

    setItemsVenta(
      itemsVenta.map((item) =>
        item.productoId === productoId
          ? {
              ...item,
              cantidad: nuevaCantidad,
              subtotal:
                item.precioUnitario * nuevaCantidad,
            }
          : item
      )
    );

    setMensajeVenta("");
  };

  const quitarItemVenta = (productoId: number) => {
    setItemsVenta(
      itemsVenta.filter(
        (item) => item.productoId !== productoId
      )
    );
  };

  const crearVenta = async () => {
    if (itemsVenta.length === 0) {
      setMensajeVenta(
        "La venta debe contener al menos un producto"
      );
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:3000/ventas",
        {
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMensajeVenta(
          data.message ||
            "No se pudo registrar la venta"
        );
        return;
      }

      setMensajeVenta(
        "Venta registrada correctamente"
      );

      setItemsVenta([]);
      setProductoVentaId("");
      setCantidadVenta("");

      cargarProductos();
      cargarVentas();
      cargarProductosStockBajo();
    } catch (error) {
      console.error(
        "Error al registrar venta:",
        error
      );

      setMensajeVenta(
        "Error al registrar la venta"
      );
    }
  };

  // =========================
  // STOCK
  // =========================

  const abrirReposicion = (productoId: number) => {
    setProductoReposicionId(productoId);
    setCantidadReposicion("");
    setMensajeReposicion("");
    setSeccionActiva("stock");
  };

  const reponerStock = async (
    event: SyntheticEvent<HTMLFormElement>
  ) => {
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
          data.message ||
            "No se pudo reponer el stock"
        );
        return;
      }

      setMensajeReposicion(
        "Stock repuesto correctamente"
      );

      setCantidadReposicion("");
      setProductoReposicionId(null);

      cargarProductos();
      cargarProductosStockBajo();
    } catch (error) {
      console.error(
        "Error al reponer stock:",
        error
      );

      setMensajeReposicion(
        "Error al reponer el stock"
      );
    }
  };

  // =========================
  // INTERFAZ
  // =========================

  return (
    <AppShell
      navbar={{
        width: 250,
        breakpoint: "sm",
      }}
      padding="xl"
    >
      <Sidebar
        seccionActiva={seccionActiva}
        cambiarSeccion={setSeccionActiva}
      />

      <AppShell.Main bg="#f8f9fa">
        <Container size="xl">
          <Text
            size="xs"
            c="dimmed"
            fw={600}
            mb={4}
          >
            Gestión comercial
          </Text>

          <Title order={1} mb="xl">
            {seccionActiva === "inicio" && "Inicio"}
            {seccionActiva === "productos" &&
              "Productos"}
            {seccionActiva === "venta" &&
              "Nueva venta"}
            {seccionActiva === "historial" &&
              "Historial"}
            {seccionActiva === "stock" && "Stock"}
          </Title>

          {/* ========================= */}
          {/* INICIO */}
          {/* ========================= */}

          {seccionActiva === "inicio" && (
            <Dashboard />
          )}

          {/* ========================= */}
          {/* PRODUCTOS */}
          {/* ========================= */}

          {seccionActiva === "productos" && (
            <Stack gap="lg">
              <Paper
                withBorder
                radius="lg"
                p="xl"
                shadow="xs"
              >
                <Group
                  justify="space-between"
                  mb="lg"
                >
                  <div>
                    <Title order={2} size="h3">
                      Productos
                    </Title>

                    <Text
                      size="sm"
                      c="dimmed"
                      mt={4}
                    >
                      Administrá los productos
                      disponibles en el inventario.
                    </Text>
                  </div>

                  <Button
                    color="violet"
                    onClick={() =>
                      setMostrarNuevoProducto(
                        !mostrarNuevoProducto
                      )
                    }
                  >
                    {mostrarNuevoProducto
                      ? "Cancelar"
                      : "Nuevo producto"}
                  </Button>
                </Group>

                {mostrarNuevoProducto && (
                  <Paper
                    withBorder
                    radius="md"
                    p="lg"
                    mb="xl"
                    bg="gray.0"
                  >
                    <Title
                      order={3}
                      size="h4"
                      mb="md"
                    >
                      Agregar producto
                    </Title>

                    <form
                      onSubmit={crearProducto}
                    >
                      <Group
                        align="flex-end"
                        grow
                      >
                        <TextInput
                          label="Nombre"
                          placeholder="Ej. Coca Cola 2.25L"
                          value={nombre}
                          onChange={(event) =>
                            setNombre(
                              event.target.value
                            )
                          }
                          required
                        />

                        <NumberInput
                          label="Precio"
                          placeholder="0"
                          value={precio}
                          onChange={(value) =>
                            setPrecio(
                              String(value)
                            )
                          }
                          min={0}
                          decimalScale={2}
                          required
                        />

                        <NumberInput
                          label="Stock inicial"
                          placeholder="0"
                          value={stock}
                          onChange={(value) =>
                            setStock(String(value))
                          }
                          min={0}
                          required
                        />

                        <NumberInput
                          label="Stock mínimo"
                          placeholder="0"
                          value={stockMinimo}
                          onChange={(value) =>
                            setStockMinimo(
                              String(value)
                            )
                          }
                          min={0}
                          required
                        />

                        <Select
                          label="Categoría"
                          placeholder="Seleccionar"
                          data={categorias.map(
                            (categoria) => ({
                              value: String(
                                categoria.id
                              ),
                              label:
                                categoria.nombre,
                            })
                          )}
                          value={categoriaId}
                          onChange={(value) =>
                            setCategoriaId(
                              value ?? ""
                            )
                          }
                          required
                        />

                        <Button
                          type="submit"
                          color="violet"
                        >
                          Guardar
                        </Button>
                      </Group>
                    </form>
                  </Paper>
                )}

                {productos.length === 0 ? (
                  <Text c="dimmed">
                    No hay productos cargados.
                  </Text>
                ) : (
                  <Table
                    striped
                    highlightOnHover
                    withTableBorder
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>
                          Producto
                        </Table.Th>

                        <Table.Th>
                          Categoría
                        </Table.Th>

                        <Table.Th>
                          Precio
                        </Table.Th>

                        <Table.Th>
                          Stock
                        </Table.Th>

                        <Table.Th>
                          Estado
                        </Table.Th>

                        <Table.Th>
                          Acciones
                        </Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {productos.map(
                        (producto) => (
                          <Table.Tr
                            key={producto.id}
                          >
                            <Table.Td>
                              <Text fw={600}>
                                {
                                  producto.nombre
                                }
                              </Text>
                            </Table.Td>

                            <Table.Td>
                              {producto
                                .categoria
                                ?.nombre ??
                                "Sin categoría"}
                            </Table.Td>

                            <Table.Td>
                              $
                              {Number(
                                producto.precio
                              ).toLocaleString(
                                "es-AR"
                              )}
                            </Table.Td>

                            <Table.Td>
                              <Badge
                                color={
                                  producto.stock <=
                                  producto.stockMinimo
                                    ? "red"
                                    : "violet"
                                }
                                variant="light"
                              >
                                {
                                  producto.stock
                                }
                              </Badge>
                            </Table.Td>

                            <Table.Td>
                              <Badge
                                color={
                                  producto.activo
                                    ? "green"
                                    : "gray"
                                }
                                variant="light"
                              >
                                {producto.activo
                                  ? "Activo"
                                  : "Inactivo"}
                              </Badge>
                            </Table.Td>

                            <Table.Td>
                              <Group gap="xs">
                                <Button
                                  size="xs"
                                  variant="light"
                                  color="violet"
                                  onClick={() =>
                                    seleccionarProductoParaEditar(
                                      producto
                                    )
                                  }
                                >
                                  Editar
                                </Button>

                                <Button
                                  size="xs"
                                  variant="light"
                                  color="blue"
                                  onClick={() =>
                                    abrirReposicion(
                                      producto.id
                                    )
                                  }
                                >
                                  Stock
                                </Button>

                                {producto.activo && (
                                  <Button
                                    size="xs"
                                    variant="light"
                                    color="red"
                                    onClick={() =>
                                      desactivarProducto(
                                        producto.id
                                      )
                                    }
                                  >
                                    Desactivar
                                  </Button>
                                )}
                              </Group>
                            </Table.Td>
                          </Table.Tr>
                        )
                      )}
                    </Table.Tbody>
                  </Table>
                )}
              </Paper>

              {productoEditandoId !== null && (
                <Paper
                  withBorder
                  radius="lg"
                  p="xl"
                  shadow="xs"
                >
                  <Title
                    order={2}
                    size="h3"
                  >
                    Editar producto
                  </Title>

                  <Text
                    size="sm"
                    c="dimmed"
                    mt={4}
                    mb="lg"
                  >
                    Modificá los datos
                    principales del producto.
                  </Text>

                  <form
                    onSubmit={editarProducto}
                  >
                    <Group
                      align="flex-end"
                      grow
                    >
                      <TextInput
                        label="Nombre"
                        value={nombreEdit}
                        onChange={(event) =>
                          setNombreEdit(
                            event.target.value
                          )
                        }
                        required
                      />

                      <NumberInput
                        label="Precio"
                        value={precioEdit}
                        onChange={(value) =>
                          setPrecioEdit(
                            String(value)
                          )
                        }
                        min={0}
                        decimalScale={2}
                        required
                      />

                      <NumberInput
                        label="Stock mínimo"
                        value={stockMinimoEdit}
                        onChange={(value) =>
                          setStockMinimoEdit(
                            String(value)
                          )
                        }
                        min={0}
                        required
                      />

                      <Select
                        label="Categoría"
                        data={categorias.map(
                          (categoria) => ({
                            value: String(
                              categoria.id
                            ),
                            label:
                              categoria.nombre,
                          })
                        )}
                        value={categoriaEditId}
                        onChange={(value) =>
                          setCategoriaEditId(
                            value ?? ""
                          )
                        }
                        required
                      />

                      <Button
                        type="submit"
                        color="violet"
                      >
                        Guardar cambios
                      </Button>

                      <Button
                        type="button"
                        variant="light"
                        color="gray"
                        onClick={() =>
                          setProductoEditandoId(
                            null
                          )
                        }
                      >
                        Cancelar
                      </Button>
                    </Group>
                  </form>
                </Paper>
              )}
            </Stack>
          )}

          {/* ========================= */}
          {/* NUEVA VENTA */}
          {/* ========================= */}

          {seccionActiva === "venta" && (
            <Paper
              withBorder
              radius="lg"
              p="xl"
              shadow="xs"
            >
              <Stack gap="lg">
                <div>
                  <Title order={2} size="h3">
                    Nueva venta
                  </Title>

                  <Text size="sm" c="dimmed" mt={4}>
                    Seleccioná los productos y confirmá la venta.
                  </Text>
                </div>

                <form onSubmit={agregarItemVenta}>
                  <Group align="flex-end">
                    <Select
                      label="Producto"
                      placeholder="Seleccionar producto"
                      data={productos
                        .filter((producto) => producto.activo)
                        .map((producto) => ({
                          value: String(producto.id),
                          label: `${producto.nombre} - $${producto.precio} - Stock: ${producto.stock}`,
                        }))}
                      value={productoVentaId}
                      onChange={(value) =>
                        setProductoVentaId(value ?? "")
                      }
                      searchable
                      style={{ flex: 1 }}
                      required
                    />

                    <NumberInput
                      label="Cantidad"
                      value={cantidadVenta}
                      onChange={(value) =>
                        setCantidadVenta(String(value))
                      }
                      min={1}
                      step={1}
                      w={140}
                      required
                    />

                    <Button
                      type="submit"
                      color="violet"
                    >
                      Agregar
                    </Button>
                  </Group>
                </form>

                <Divider />

                <div>
                  <Group
                    justify="space-between"
                    mb="md"
                  >
                    <Title order={3} size="h4">
                      Detalle de venta
                    </Title>

                    <Badge
                      color="violet"
                      variant="light"
                    >
                      {itemsVenta.length} productos
                    </Badge>
                  </Group>

                  {itemsVenta.length === 0 ? (
                    <Text c="dimmed" size="sm">
                      Todavía no agregaste productos a la venta.
                    </Text>
                  ) : (
                    <Table
                      withTableBorder
                      highlightOnHover
                    >
                      <Table.Thead>
                        <Table.Tr>
                          <Table.Th>Producto</Table.Th>
                          <Table.Th>Precio</Table.Th>
                          <Table.Th>Cantidad</Table.Th>
                          <Table.Th>Subtotal</Table.Th>
                          <Table.Th></Table.Th>
                        </Table.Tr>
                      </Table.Thead>

                      <Table.Tbody>
                        {itemsVenta.map((item) => (
                          <Table.Tr key={item.productoId}>
                            <Table.Td>
                              <Text fw={600}>
                                {item.nombre}
                              </Text>
                            </Table.Td>

                            <Table.Td>
                              $
                              {item.precioUnitario.toLocaleString(
                                "es-AR"
                              )}
                            </Table.Td>

                            <Table.Td>
                              <NumberInput
                                value={item.cantidad}
                                onChange={(value) =>
                                  modificarCantidadItem(
                                    item.productoId,
                                    String(value)
                                  )
                                }
                                min={1}
                                step={1}
                                w={90}
                              />
                            </Table.Td>

                            <Table.Td>
                              $
                              {item.subtotal.toLocaleString(
                                "es-AR"
                              )}
                            </Table.Td>

                            <Table.Td>
                              <Button
                                size="xs"
                                variant="light"
                                color="red"
                                onClick={() =>
                                  quitarItemVenta(
                                    item.productoId
                                  )
                                }
                              >
                                Quitar
                              </Button>
                            </Table.Td>
                          </Table.Tr>
                        ))}
                      </Table.Tbody>
                    </Table>
                  )}
                </div>

                {itemsVenta.length > 0 && (
                  <>
                    <Divider />

                    <Group justify="space-between">
                      <div>
                        <Text size="sm" c="dimmed">
                          Total de la venta
                        </Text>

                        <Title order={2}>
                          $
                          {itemsVenta
                            .reduce(
                              (total, item) =>
                                total + item.subtotal,
                              0
                            )
                            .toLocaleString("es-AR")}
                        </Title>
                      </div>

                      <Button
                        size="md"
                        color="violet"
                        onClick={crearVenta}
                      >
                        Registrar venta
                      </Button>
                    </Group>
                  </>
                )}

                {mensajeVenta && (
                  <Text
                    size="sm"
                    fw={500}
                    c={
                      mensajeVenta.includes("correctamente")
                        ? "green"
                        : "red"
                    }
                  >
                    {mensajeVenta}
                  </Text>
                )}
              </Stack>
            </Paper>
          )}

          {/* ========================= */}
          {/* HISTORIAL */}
          {/* ========================= */}

          {seccionActiva === "historial" && (
            <Paper
              withBorder
              radius="lg"
              p="xl"
              shadow="xs"
            >
              <Stack gap="lg">
                <div>
                  <Title order={2} size="h3">
                    Historial de ventas
                  </Title>

                  <Text size="sm" c="dimmed" mt={4}>
                    Consultá las ventas registradas y su detalle.
                  </Text>
                </div>

                {ventas.length === 0 ? (
                  <Text c="dimmed">
                    No hay ventas registradas.
                  </Text>
                ) : (
                  <Accordion variant="separated">
                    {ventas.map((venta) => (
                      <Accordion.Item
                        key={venta.id}
                        value={String(venta.id)}
                      >
                        <Accordion.Control>
                          <Group
                            justify="space-between"
                            pr="md"
                          >
                            <div>
                              <Text fw={600}>
                                Venta #{venta.id}
                              </Text>

                              <Text
                                size="xs"
                                c="dimmed"
                              >
                                {new Date(
                                  venta.fecha
                                ).toLocaleString(
                                  "es-AR"
                                )}
                              </Text>
                            </div>

                            <Badge
                              color="violet"
                              variant="light"
                              size="lg"
                            >
                              $
                              {Number(
                                venta.total
                              ).toLocaleString(
                                "es-AR",
                                {
                                  minimumFractionDigits: 2,
                                }
                              )}
                            </Badge>
                          </Group>
                        </Accordion.Control>

                        <Accordion.Panel>
                          <Table
                            withTableBorder
                            striped
                            highlightOnHover
                          >
                            <Table.Thead>
                              <Table.Tr>
                                <Table.Th>
                                  Producto
                                </Table.Th>

                                <Table.Th>
                                  Cantidad
                                </Table.Th>

                                <Table.Th>
                                  Precio unitario
                                </Table.Th>

                                <Table.Th>
                                  Subtotal
                                </Table.Th>
                              </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                              {venta.detalles.map(
                                (detalle) => (
                                  <Table.Tr
                                    key={detalle.id}
                                  >
                                    <Table.Td>
                                      <Text fw={500}>
                                        {
                                          detalle
                                            .producto
                                            .nombre
                                        }
                                      </Text>
                                    </Table.Td>

                                    <Table.Td>
                                      {
                                        detalle.cantidad
                                      }
                                    </Table.Td>

                                    <Table.Td>
                                      $
                                      {Number(
                                        detalle.precioUnitario
                                      ).toLocaleString(
                                        "es-AR",
                                        {
                                          minimumFractionDigits: 2,
                                        }
                                      )}
                                    </Table.Td>

                                    <Table.Td>
                                      $
                                      {Number(
                                        detalle.subtotal
                                      ).toLocaleString(
                                        "es-AR",
                                        {
                                          minimumFractionDigits: 2,
                                        }
                                      )}
                                    </Table.Td>
                                  </Table.Tr>
                                )
                              )}
                            </Table.Tbody>
                          </Table>
                        </Accordion.Panel>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                )}
              </Stack>
            </Paper>
          )}

          {/* ========================= */}
          {/* STOCK */}
          {/* ========================= */}

          {seccionActiva === "stock" && (
            <Stack gap="lg">
              {productoReposicionId !== null && (
                <Paper
                  withBorder
                  radius="lg"
                  p="xl"
                  shadow="xs"
                >
                  <Title order={2} size="h3">
                    Reponer stock
                  </Title>

                  <Text size="sm" c="dimmed" mt={4} mb="lg">
                    Ingresá la cantidad que querés agregar al stock actual.
                  </Text>

                  <form onSubmit={reponerStock}>
                    <Group align="flex-end">
                      <NumberInput
                        label="Cantidad"
                        value={cantidadReposicion}
                        onChange={(value) =>
                          setCantidadReposicion(String(value))
                        }
                        min={1}
                        step={1}
                        w={180}
                        required
                      />

                      <Button
                        type="submit"
                        color="violet"
                      >
                        Confirmar reposición
                      </Button>

                      <Button
                        type="button"
                        variant="light"
                        color="gray"
                        onClick={() => {
                          setProductoReposicionId(null);
                          setCantidadReposicion("");
                          setMensajeReposicion("");
                        }}
                      >
                        Cancelar
                      </Button>
                    </Group>
                  </form>

                  {mensajeReposicion && (
                    <Text
                      mt="md"
                      size="sm"
                      fw={500}
                      c={
                        mensajeReposicion.includes("correctamente")
                          ? "green"
                          : "red"
                      }
                    >
                      {mensajeReposicion}
                    </Text>
                  )}
                </Paper>
              )}

              <Paper
                withBorder
                radius="lg"
                p="xl"
                shadow="xs"
              >
                <Group justify="space-between" mb="lg">
                  <div>
                    <Title order={2} size="h3">
                      Productos con stock bajo
                    </Title>

                    <Text size="sm" c="dimmed" mt={4}>
                      Productos cuyo stock actual alcanzó o quedó por debajo
                      del mínimo configurado.
                    </Text>
                  </div>

                  <Badge
                    color={
                      productosStockBajo.length > 0
                        ? "red"
                        : "green"
                    }
                    variant="light"
                    size="lg"
                  >
                    {productosStockBajo.length} productos
                  </Badge>
                </Group>

                {productosStockBajo.length === 0 ? (
                  <Text c="dimmed">
                    No hay productos con stock bajo.
                  </Text>
                ) : (
                  <Table
                    striped
                    highlightOnHover
                    withTableBorder
                  >
                    <Table.Thead>
                      <Table.Tr>
                        <Table.Th>Producto</Table.Th>
                        <Table.Th>Categoría</Table.Th>
                        <Table.Th>Stock actual</Table.Th>
                        <Table.Th>Stock mínimo</Table.Th>
                        <Table.Th>Acción</Table.Th>
                      </Table.Tr>
                    </Table.Thead>

                    <Table.Tbody>
                      {productosStockBajo.map((producto) => (
                        <Table.Tr key={producto.id}>
                          <Table.Td>
                            <Text fw={600}>
                              {producto.nombre}
                            </Text>
                          </Table.Td>

                          <Table.Td>
                            {producto.categoria?.nombre ??
                              "Sin categoría"}
                          </Table.Td>

                          <Table.Td>
                            <Badge
                              color="red"
                              variant="light"
                            >
                              {producto.stock}
                            </Badge>
                          </Table.Td>

                          <Table.Td>
                            {producto.stockMinimo}
                          </Table.Td>

                          <Table.Td>
                            <Button
                              size="xs"
                              color="violet"
                              variant="light"
                              onClick={() =>
                                abrirReposicion(producto.id)
                              }
                            >
                              Reponer stock
                            </Button>
                          </Table.Td>
                        </Table.Tr>
                      ))}
                    </Table.Tbody>
                  </Table>
                )}
              </Paper>
            </Stack>
          )}
        </Container>
      </AppShell.Main>
    </AppShell>
  );
}

export default App;