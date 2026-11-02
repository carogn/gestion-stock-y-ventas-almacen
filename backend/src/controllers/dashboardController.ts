import { Request, Response } from "express";
import { QueryTypes } from "sequelize";
import database from "../config/database";

// Comprueba el formato y que la fecha exista realmente.
function fechaValida(valor: unknown): valor is string {
  return (
    typeof valor === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(valor) &&
    !Number.isNaN(Date.parse(valor)) &&
    new Date(valor).toISOString().slice(0, 10) === valor
  );
}

export const obtenerDashboard = async (
  req: Request,
  res: Response
) => {
  const { desde, hasta } = req.query;

  if (
    (desde !== undefined && !fechaValida(desde)) ||
    (hasta !== undefined && !fechaValida(hasta)) ||
    (
      typeof desde === "string" &&
      typeof hasta === "string" &&
      desde > hasta
    )
  ) {
    return res.status(400).json({
      message:
        "Usá fechas válidas YYYY-MM-DD y desde menor o igual a hasta",
    });
  }

  try {
    // Agregamos ventas y detalles por separado para evitar
    // contar varias veces el total de una venta multiproducto.
    const [resultado] = await database.query<{
      dashboard: object;
    }>(
      `
      WITH ventas_periodo AS (
        SELECT
          id,
          total,
          (
            fecha AT TIME ZONE 'America/Argentina/Buenos_Aires'
          )::date AS dia
        FROM ventas
        WHERE (
          CAST(:desde AS date) IS NULL
          OR fecha >= (
            CAST(:desde AS date)::timestamp
            AT TIME ZONE 'America/Argentina/Buenos_Aires'
          )
        )
        AND (
          CAST(:hasta AS date) IS NULL
          OR fecha < (
            (CAST(:hasta AS date) + 1)::timestamp
            AT TIME ZONE 'America/Argentina/Buenos_Aires'
          )
        )
      ),
      resumen AS (
        SELECT
          COALESCE(SUM(total), 0) AS facturacion,
          COUNT(*) AS cantidad
        FROM ventas_periodo
      ),
      ranking AS (
        SELECT
          p.id AS "productoId",
          p.nombre,
          SUM(d.cantidad) AS unidades
        FROM detalles_venta d
        JOIN ventas_periodo v ON v.id = d.venta_id
        JOIN productos p ON p.id = d.producto_id
        GROUP BY p.id, p.nombre
        ORDER BY unidades DESC, p.id ASC
        LIMIT 5
      ),
      evolucion AS (
        SELECT
          dia,
          SUM(total) AS facturacion
        FROM ventas_periodo
        GROUP BY dia
        ORDER BY dia
      )
      SELECT json_build_object(
        'facturacionTotal', r.facturacion,
        'cantidadVentas', r.cantidad,
        'ticketPromedio',
          CASE
            WHEN r.cantidad = 0 THEN 0
            ELSE ROUND(r.facturacion / r.cantidad, 2)
          END,
        'unidadesVendidas', (
          SELECT COALESCE(SUM(d.cantidad), 0)
          FROM detalles_venta d
          JOIN ventas_periodo v ON v.id = d.venta_id
        ),
        'productosStockBajo', (
          SELECT COUNT(*)
          FROM productos
          WHERE activo = true
            AND stock <= stock_minimo
        ),
        'productosMasVendidos',
          COALESCE(
            (SELECT json_agg(ranking) FROM ranking),
            '[]'::json
          ),
        'evolucionVentas',
          COALESCE(
            (
              SELECT json_agg(
                json_build_object(
                  'fecha', dia,
                  'facturacion', facturacion
                )
              )
              FROM evolucion
            ),
            '[]'::json
          )
      ) AS dashboard
      FROM resumen r
      `,
      {
        replacements: {
          desde: desde ?? null,
          hasta: hasta ?? null,
        },
        type: QueryTypes.SELECT,
      }
    );

    return res.json(resultado.dashboard);
  } catch (error) {
    console.error("Error al obtener dashboard:", error);

    return res.status(500).json({
      message: "Error al obtener las métricas del dashboard",
    });
  }
};