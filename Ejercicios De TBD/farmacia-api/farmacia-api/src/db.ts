import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/farmacia_db';

export const sql = postgres(connectionString);

// Inicializa la base de datos y crea la tabla si no existe
export async function initDb() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS medicamentos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(120) NOT NULL,
        laboratorio VARCHAR(100) NOT NULL,
        precio DECIMAL(10, 2) NOT NULL,
        stock INT DEFAULT 0,
        requiere_receta BOOLEAN DEFAULT false,
        creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log('✅ Base de datos e historia de tablas inicializadas correctamente.');
  } catch (error) {
    console.error('❌ Error al inicializar la base de datos:', error);
  }
}