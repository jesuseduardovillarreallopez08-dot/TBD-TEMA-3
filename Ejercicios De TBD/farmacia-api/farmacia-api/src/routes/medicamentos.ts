import { Elysia, t } from 'elysia';
import { sql } from '../db';

export const medicamentosRoutes = new Elysia({ prefix: '/api/medicamentos' })
  // GET: Obtener todos los medicamentos
  .get('/', async () => {
    return await sql`SELECT * FROM medicamentos ORDER BY id ASC`;
  })

  // GET: Obtener un medicamento por ID
  .get('/:id', async ({ params: { id }, set }) => {
    const [medicamento] = await sql`SELECT * FROM medicamentos WHERE id = ${id}`;
    if (!medicamento) {
      set.status = 404;
      return { mensaje: 'Medicamento no encontrado' };
    }
    return medicamento;
  })

  // POST: Registrar un nuevo medicamento
  .post(
    '/',
    async ({ body, set }) => {
      const { nombre, laboratorio, precio, stock, requiere_receta } = body;
      const [nuevo] = await sql`
        INSERT INTO medicamentos (nombre, laboratorio, precio, stock, requiere_receta)
        VALUES (${nombre}, ${laboratorio}, ${precio}, ${stock ?? 0}, ${requiere_receta ?? false})
        RETURNING *
      `;
      set.status = 201;
      return nuevo;
    },
    {
      body: t.Object({
        nombre: t.String(),
        laboratorio: t.String(),
        precio: t.Number(),
        stock: t.Optional(t.Number()),
        requiere_receta: t.Optional(t.Boolean()),
      }),
    }
  )

  // PUT: Actualizar un medicamento por ID
  .put(
    '/:id',
    async ({ params: { id }, body, set }) => {
      const { nombre, laboratorio, precio, stock, requiere_receta } = body;
      const [actualizado] = await sql`
        UPDATE medicamentos
        SET nombre = ${nombre}, laboratorio = ${laboratorio}, precio = ${precio}, stock = ${stock}, requiere_receta = ${requiere_receta}
        WHERE id = ${id}
        RETURNING *
      `;
      if (!actualizado) {
        set.status = 404;
        return { mensaje: 'Medicamento no encontrado' };
      }
      return actualizado;
    },
    {
      body: t.Object({
        nombre: t.String(),
        laboratorio: t.String(),
        precio: t.Number(),
        stock: t.Number(),
        requiere_receta: t.Boolean(),
      }),
    }
  )

  // DELETE: Eliminar un medicamento por ID
  .delete('/:id', async ({ params: { id }, set }) => {
    const resultado = await sql`DELETE FROM medicamentos WHERE id = ${id}`;
    if (resultado.count === 0) {
      set.status = 404;
      return { mensaje: 'Medicamento no encontrado' };
    }
    return { mensaje: 'Medicamento eliminado correctamente' };
  });