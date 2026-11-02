import {
  AppShell,
  Avatar,
  Group,
  NavLink,
  Stack,
  Text,
  ThemeIcon,
} from "@mantine/core";

import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  History,
  Boxes,
} from "lucide-react";

type Seccion =
  | "inicio"
  | "productos"
  | "venta"
  | "historial"
  | "stock";

type SidebarProps = {
  seccionActiva: Seccion;
  cambiarSeccion: (seccion: Seccion) => void;
};

function Sidebar({
  seccionActiva,
  cambiarSeccion,
}: SidebarProps) {
  const opciones = [
    {
      id: "inicio" as Seccion,
      texto: "Inicio",
      icono: LayoutDashboard,
    },
    {
      id: "productos" as Seccion,
      texto: "Productos",
      icono: Package,
    },
    {
      id: "venta" as Seccion,
      texto: "Nueva venta",
      icono: ShoppingCart,
    },
    {
      id: "historial" as Seccion,
      texto: "Historial",
      icono: History,
    },
    {
      id: "stock" as Seccion,
      texto: "Stock",
      icono: Boxes,
    },
  ];

  return (
    <AppShell.Navbar p="md">
      <AppShell.Section mb="xl">
        <Group gap="sm">
          <ThemeIcon
            size="lg"
            radius="md"
            color="violet"
          >
            N
          </ThemeIcon>

          <div>
            <Text fw={700}>Nexo</Text>

            <Text size="xs" c="dimmed">
              Gestión comercial
            </Text>
          </div>
        </Group>
      </AppShell.Section>

      <AppShell.Section grow>
        <Stack gap={4}>
          {opciones.map((opcion) => {
            const Icono = opcion.icono;

            return (
              <NavLink
                key={opcion.id}
                label={opcion.texto}
                leftSection={
                  <Icono size={18} />
                }
                active={
                  seccionActiva === opcion.id
                }
                color="violet"
                variant="light"
                onClick={() =>
                  cambiarSeccion(opcion.id)
                }
              />
            );
          })}
        </Stack>
      </AppShell.Section>

      <AppShell.Section>
        <Group>
          <Avatar
            color="violet"
            radius="xl"
          >
            CG
          </Avatar>

          <div>
            <Text size="sm" fw={600}>
              Carolina
            </Text>

            <Text size="xs" c="dimmed">
              Administradora
            </Text>
          </div>
        </Group>
      </AppShell.Section>
    </AppShell.Navbar>
  );
}

export default Sidebar;
export type { Seccion };