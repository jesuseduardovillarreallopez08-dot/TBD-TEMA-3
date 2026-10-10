import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { initDb } from './db';
import { medicamentosRoutes } from './routes/medicamentos';

// Inicializar la base de datos y crear tablas
await initDb();

const app = new Elysia()
  .use(cors())
  .use(medicamentosRoutes)
  .listen(process.env.PORT || 3000);

console.log(`🦊 API de Farmacia corriendo en http://${app.server?.hostname}:${app.server?.port}`);