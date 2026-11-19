
# Mandadito — Sistema de Gestión de Stock y Ventas

**Proyecto Integrador — Universidad Nacional de Hurlingham (UNAHUR)**

**Desarrollado por:** Carolina Gonzalez Pisarello

## Descripción

Mandadito es una aplicación web desarrollada para facilitar la gestión de productos, stock y ventas en pequeños comercios y almacenes.

Su objetivo es centralizar las operaciones del negocio, automatizar la actualización del inventario y brindar información útil para la toma de decisiones.

## Tecnologías utilizadas

**Frontend**
- React
- TypeScript
- Vite
- Mantine
- Recharts

**Backend**
- Node.js
- Express
- TypeScript
- Sequelize ORM
- JWT para autenticación
- bcryptjs para el almacenamiento seguro de contraseñas

**Base de datos**
- PostgreSQL

## Funcionalidades principales

- Autenticación de usuarios.
- Gestión de productos y categorías.
- Registro de reposiciones de stock.
- Registro de ventas con uno o varios productos.
- Validación de stock disponible.
- Actualización automática del inventario al confirmar ventas.
- Historial de ventas.
- Baja lógica de productos.
- Dashboard con indicadores comerciales y alertas de stock bajo.

## Requisitos previos

Para ejecutar el proyecto localmente se necesita:

- Node.js y npm.
- PostgreSQL instalado y en funcionamiento.
- Una base de datos PostgreSQL creada para la aplicación.

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/carogn/gestion-stock-y-ventas-almacen.git
cd gestion-stock-y-ventas-almacen
```

### 2. Configurar el backend

Ingresar a la carpeta `backend` e instalar las dependencias:

```bash
cd backend
npm install
```

Crear un archivo `.env` dentro de la carpeta `backend` con las siguientes variables:

```env
DB_NAME=nombre_base
DB_USER=usuario_postgres
DB_PASSWORD=contraseña_postgres
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=clave_secreta_segura
PORT=3000

ADMIN_NOMBRE=Administrador
ADMIN_EMAIL=admin@ejemplo.com
ADMIN_PASSWORD=contraseña_segura_para_el_administrador
```

Reemplazar los valores de ejemplo con los correspondientes al entorno local.

**Importante:** el archivo `.env` contiene información sensible y no debe subirse al repositorio.

### 3. Crear el usuario inicial

Antes de iniciar sesión por primera vez, se debe crear un usuario administrador.

Con PostgreSQL en funcionamiento y las variables de entorno configuradas, ejecutar desde la carpeta `backend`:

```bash
npm run crear-admin
```

Este comando ejecuta un script que:

- Verifica la conexión con la base de datos.
- Comprueba si el usuario ya existe.
- Genera un hash de la contraseña mediante bcrypt.
- Registra el usuario si todavía no existe.

Las credenciales se obtienen de las variables de entorno y no están definidas directamente en el código fuente.

**Nota:** si ya existe un usuario con el correo indicado, el script no modifica su contraseña.

### 4. Iniciar el backend

Desde la carpeta `backend`, ejecutar:

```bash
npm run dev
```

La API estará disponible en:

`http://localhost:3000`

Al iniciar, el backend verifica la conexión a PostgreSQL y sincroniza los modelos de Sequelize.

### 5. Iniciar el frontend

Abrir otra terminal, ingresar a la carpeta `frontend` e instalar las dependencias:

```bash
cd frontend
npm install
npm run dev
```

Abrir la dirección local indicada por Vite, habitualmente:

`http://localhost:5173`

El frontend se comunica con el backend mediante solicitudes HTTP a `http://localhost:3000`.

### 6. Iniciar sesión

Ingresar a Mandadito con el correo electrónico y la contraseña configurados para el usuario administrador.

El backend valida las credenciales y genera un token JWT para permitir el acceso a las funcionalidades protegidas.

## Estado del proyecto

Mandadito es un proyecto académico funcional, desarrollado y probado en un entorno local.

Actualmente no está desplegado en producción.
