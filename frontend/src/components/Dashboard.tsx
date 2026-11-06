import { useEffect, useState } from "react";
import type { SyntheticEvent } from "react";

import {
  Button,
  Card,
  Group,
  NumberFormatter,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";

import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type DatosDashboard = {
  facturacionTotal: number;
  cantidadVentas: number;
  ticketPromedio: number;
  unidadesVendidas: number;
  productosStockBajo: number;

  productosMasVendidos: {
    productoId: number;
    nombre: string;
    unidades: number;
  }[];

  evolucionVentas: {
    fecha: string;
    facturacion: number;
  }[];
};

function mostrarFecha(fecha: string) {
  const [anio, mes, dia] = fecha.split("-");
  return `${dia}/${mes}/${anio}`;
}

type DashboardProps = {
  token: string;
};

function Dashboard({ token }: DashboardProps) {
  const [datos, setDatos] =
    useState<DatosDashboard | null>(null);

  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  async function cargarDashboard(
    fechaDesde = "",
    fechaHasta = ""
  ) {
    setCargando(true);
    setError("");

    try {
      const parametros = new URLSearchParams();

      if (fechaDesde) {
        parametros.set("desde", fechaDesde);
      }

      if (fechaHasta) {
        parametros.set("hasta", fechaHasta);
      }

      const response = await fetch(
        `http://localhost:3000/dashboard?${parametros.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const respuesta = await response.json();

        throw new Error(
          respuesta.message ||
            "No se pudo cargar el dashboard"
        );
      }

      const resultado: DatosDashboard =
        await response.json();

      setDatos(resultado);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se pudo conectar con el servidor"
      );
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetch("http://localhost:3000/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            "No se pudo cargar el dashboard"
          );
        }

        return response.json();
      })
      .then((resultado: DatosDashboard) => {
        setDatos(resultado);
      })
      .catch((error) => {
        setError(
          error instanceof Error
            ? error.message
            : "No se pudo conectar con el servidor"
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  function aplicarFiltros(
    event: SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (desde && hasta && desde > hasta) {
      setError(
        "La fecha desde no puede ser posterior a hasta"
      );
      return;
    }

    void cargarDashboard(desde, hasta);
  }

  function verTodo() {
    setDesde("");
    setHasta("");

    void cargarDashboard();
  }

  return (
    <Paper
      withBorder
      radius="lg"
      p="xl"
      shadow="xs"
    >
      <Stack gap="xl">
        <div>
          <Title order={2} size="h3">
            Resumen del negocio
          </Title>

          <Text size="sm" c="dimmed" mt={4}>
            Consultá las ventas y el estado actual del
            inventario.
          </Text>
        </div>

        <Paper
          withBorder
          radius="md"
          p="md"
          bg="gray.0"
        >
          <form onSubmit={aplicarFiltros}>
            <Group align="flex-end">
              <TextInput
                type="date"
                label="Desde"
                value={desde}
                onChange={(event) =>
                  setDesde(event.target.value)
                }
                disabled={cargando}
              />

              <TextInput
                type="date"
                label="Hasta"
                value={hasta}
                onChange={(event) =>
                  setHasta(event.target.value)
                }
                disabled={cargando}
              />

              <Button
                type="submit"
                color="violet"
                loading={cargando}
              >
                Consultar
              </Button>

              <Button
                type="button"
                variant="light"
                color="violet"
                onClick={verTodo}
                disabled={cargando}
              >
                Ver todo
              </Button>
            </Group>
          </form>
        </Paper>

        {cargando && (
          <Text c="dimmed">
            Cargando indicadores...
          </Text>
        )}

        {error && (
          <Text c="red" fw={500}>
            {error}
          </Text>
        )}

        {!cargando && !error && datos && (
          <>
            <SimpleGrid
              cols={{
                base: 1,
                sm: 2,
                lg: 5,
              }}
              spacing="md"
            >
              <Card
                withBorder
                radius="md"
                padding="lg"
              >
                <Text size="sm" c="dimmed">
                  Facturación total
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  mt={6}
                >
                  <NumberFormatter
                    prefix="$ "
                    value={datos.facturacionTotal}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Card>

              <Card
                withBorder
                radius="md"
                padding="lg"
              >
                <Text size="sm" c="dimmed">
                  Cantidad de ventas
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  mt={6}
                >
                  {datos.cantidadVentas}
                </Text>
              </Card>

              <Card
                withBorder
                radius="md"
                padding="lg"
              >
                <Text size="sm" c="dimmed">
                  Ticket promedio
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  mt={6}
                >
                  <NumberFormatter
                    prefix="$ "
                    value={datos.ticketPromedio}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fixedDecimalScale
                  />
                </Text>
              </Card>

              <Card
                withBorder
                radius="md"
                padding="lg"
              >
                <Text size="sm" c="dimmed">
                  Unidades vendidas
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  mt={6}
                >
                  {datos.unidadesVendidas}
                </Text>
              </Card>

              <Card
                withBorder
                radius="md"
                padding="lg"
              >
                <Text size="sm" c="dimmed">
                  Productos con stock bajo
                </Text>

                <Text
                  fw={700}
                  size="xl"
                  mt={6}
                >
                  {datos.productosStockBajo}
                </Text>
              </Card>
            </SimpleGrid>

            <Text size="sm" c="dimmed">
              El stock bajo refleja el estado actual del
              inventario y no cambia con el período
              seleccionado.
            </Text>

            <div>
              <Title order={3} size="h4" mb="md">
                Productos más vendidos
              </Title>

              {datos.productosMasVendidos.length ===
              0 ? (
                <Text c="dimmed">
                  No hay productos vendidos en este
                  período.
                </Text>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <BarChart
                    data={datos.productosMasVendidos}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis dataKey="nombre" />

                    <YAxis allowDecimals={false} />

                    <Tooltip />

                    <Bar
                      dataKey="unidades"
                      name="Unidades vendidas"
                      fill="#7950f2"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div>
              <Title order={3} size="h4" mb="md">
                Evolución diaria de la facturación
              </Title>

              {datos.evolucionVentas.length === 0 ? (
                <Text c="dimmed">
                  No hay ventas en este período.
                </Text>
              ) : (
                <ResponsiveContainer
                  width="100%"
                  height={300}
                >
                  <LineChart
                    data={datos.evolucionVentas}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                    />

                    <XAxis
                      dataKey="fecha"
                      tickFormatter={mostrarFecha}
                    />

                    <YAxis />

                    <Tooltip
                      labelFormatter={(fecha) =>
                        mostrarFecha(String(fecha))
                      }
                    />

                    <Line
                      type="linear"
                      dataKey="facturacion"
                      name="Facturación ($)"
                      stroke="#7950f2"
                      strokeWidth={3}
                      dot
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            <Text size="xs" c="dimmed">
              La evolución muestra únicamente los días
              con ventas.
            </Text>
          </>
        )}
      </Stack>
    </Paper>
  );
}

export default Dashboard;