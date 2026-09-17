# API REST de tareas

API REST construida con Node.js, Express, Prisma y MySQL para gestionar tareas.

## Instalación

```bash
npm install
npm run db:migrate
npm start
```

La API queda disponible en `http://localhost:3000`.

Configura `JWT_SECRET` en producción. La conexión se configura en `.env` mediante `DATABASE_URL`.

## Migraciones Prisma

Con MySQL ejecutándose y la base `tareas_db` disponible, ejecuta:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

Los mismos comandos están disponibles como `npm run db:generate` y `npm run db:migrate`.

## Endpoints

- `POST /auth/registro`: crea un usuario con `{ "email": "ana@example.com", "password": "secreto" }`.
- `POST /auth/login`: devuelve un JWT con `{ "email": "ana@example.com", "password": "secreto" }`.

Todas las rutas `/tareas` requieren `Authorization: Bearer <token>` y solo muestran las tareas del usuario autenticado.

- `GET /tareas`: lista las tareas propias.
- `GET /tareas/:id`: obtiene una tarea.
- `POST /tareas`: crea una tarea.
- `PUT /tareas/:id`: actualiza una tarea.
- `PATCH /tareas/:id/completar`: marca una tarea como completada.
- `DELETE /tareas/:id`: elimina una tarea.

Ejemplo de cuerpo para crear o actualizar:

```json
{
  "titulo": "Preparar documentación",
  "descripcion": "Escribir el README de la API",
  "completada": false
}
```

Los usuarios y tareas se almacenan en MySQL y persisten al reiniciar el servidor.
