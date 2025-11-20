## Portal Elecciones – Stack dockerizado

### Requisitos previos
- Docker y Docker Compose instalados.
- Puerto 8080 libre para el frontend, 3000 para el backend y 5432 para PostgreSQL (puedes cambiarlos en `docker-compose.yml`).

### Servicios incluidos
| Servicio   | Imagen/base             | Puerto host | Descripción |
|------------|-------------------------|-------------|-------------|
| `db`       | `postgres:15-alpine`    | 5432        | Base de datos PostgreSQL con scripts `db/schema.sql` y `db/seed.sql` montados automáticamente. |
| `backend`  | Dockerfile NestJS       | 3000        | API NestJS/TypeORM que lee variables de entorno definidas en `docker-compose.yml`. |
| `frontend` | Dockerfile Angular+Nginx| 8080        | Build Angular servido por Nginx con proxy a `/api` → backend. |

### Puesta en marcha
```bash
docker-compose up --build
```

- Backend disponible en `http://localhost:3000/api`.
- Frontend en `http://localhost:8080` (ya proxy a `/api`).
- PostgreSQL accesible en `localhost:5432` con credenciales `elecciones/elecciones`.

Para ejecutar en segundo plano:
```bash
docker-compose up --build -d
```

### Variables y ajustes
- Cambia `JWT_SECRET`, credenciales de DB o puertos editando `docker-compose.yml`.
- `ANON_USER_ID` debe coincidir con el registro seed del usuario anónimo.
- Volumen `postgres-data` persiste los datos. Para reiniciar la base borra el volumen (`docker volume rm elecciones_v2_postgres-data`) antes de recrear los contenedores.

### Comandos útiles
- Ver logs de un servicio: `docker-compose logs -f backend`
- Reconstruir solo un servicio: `docker-compose build frontend`
- Detener todo: `docker-compose down`
