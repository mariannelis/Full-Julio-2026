# Blog Fullstack — Día 38

**Práctica: Desarrollo de un blog con usuarios registrados y comentarios.**

## Descripción
El blog ofrece una lectura pública de publicaciones y comentarios. Tras registrarse e iniciar sesión, los usuarios pueden crear publicaciones con imagen obligatoria, editar y eliminar sus publicaciones, comentar y modificar o eliminar sus propios comentarios. La autorización para cambios se comprueba también en el backend.

## Tecnologías
- **Frontend:** React, Vite, Tailwind CSS, Axios, Context API y `localStorage`.
- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, bcryptjs, JWT y CORS.
- **Despliegue previsto:** dos proyectos en Vercel conectados a un repositorio GitHub.

## Requisitos cubiertos
- Registro e inicio de sesión con JWT.
- CRUD de publicaciones y comentarios; escritura protegida y limitada al autor al editar/eliminar.
- GET público de publicaciones y comentarios.
- Imágenes obligatorias en formato Base64 almacenadas como cadenas en MongoDB.
- Sesión global y persistente con Context API y almacenamiento del navegador.
- Tailwind CSS para el frontend.
- Configuración para dos despliegues independientes en Vercel.

## Carpetas
```text
Dia38_Blog_Fullstack_Nuevo/
  backend/
    api/index.js            # entrada serverless Vercel
    server.js               # servidor local
    src/config/db.js        # conexión MongoDB
    src/middleware/         # JWT
    src/models/             # User, Post, Comment
    src/routes/             # rutas REST
    .env.example            # valores de ejemplo SIN secretos
    vercel.json
  frontend/
    src/components/         # UI de blog, edición y comentarios
    src/context/            # AuthContext
    src/services/           # cliente Axios
    .env.example
    vercel.json
  .gitignore
  README.md
```

## Instalación en Windows / VS Code
1. Instala Node.js 20+ y abre la carpeta descomprimida en VS Code.
2. Abre terminal en `backend` y ejecuta `npm install`.
3. Copia `backend/.env.example` a `backend/.env` (no cambies ni subas el ejemplo; crea un archivo nuevo).
4. Completa `MONGODB_URI` con el usuario, contraseña y host **actuales** de MongoDB Atlas, y `JWT_SECRET` con una clave **nueva**, larga y privada. La base puede llamarse `blog_dia38` dentro de tu clúster existente. `PORT=5000`.
5. En la terminal de backend ejecuta `npm run dev`.
6. En otra terminal entra en `frontend` y ejecuta `npm install`.
7. Copia `frontend/.env.example` a `frontend/.env` con `VITE_API_URL=http://localhost:5000/api`.
8. Ejecuta `npm run dev` desde frontend y abre http://localhost:5173.
9. Prueba la API en http://localhost:5000/ para ver `API del blog funcionando correctamente`.

**Nunca compartas ni subas contraseñas, claves JWT o archivos `.env`.** Las credenciales expuestas previamente deben rotarse desde Atlas y sustituirse por un JWT secreto nuevo antes de subir el proyecto.

## Solucionar `querySrv ECONNREFUSED`
Si `nslookup -type=SRV _mongodb._tcp.TU-CLUSTER.mongodb.net` funciona y `Test-NetConnection TU-HOST -Port 27017` muestra `True`, pero Node.js sigue con `querySrv ECONNREFUSED`, intenta en este orden:

**A. DNS alternativo únicamente en backend local:** añade en `backend/.env` la línea `DNS_SERVERS=1.1.1.1,8.8.8.8`, reinicia la terminal y vuelve a ejecutar `npm run dev`. El `server.js` está preparado para aplicar esa configuración antes de iniciar Mongoose. Puede no funcionar en redes que bloquean esos DNS externos.

**B. Cadena de conexión Standard, sin SRV:** entra a Atlas -> Connect -> Drivers y, si aparece, desactiva *SRV connection string* / selecciona *Standard connection string*. Copia la URI `mongodb://host0:27017,host1:27017,...` tal como la ofrece Atlas (incluye replicaSet, authSource, tls y opciones correctas). En `backend/.env` pega esa URI en `MONGODB_URI_STANDARD=...`. Esta variable tiene prioridad sobre `MONGODB_URI` y evita las consultas DNS SRV. **No inventes servidores ni el nombre del replica set.**

**C. Verifica la IP en MongoDB Atlas -> Network Access, los permisos del usuario en Database Access y que tu antivirus/red permita conexiones a los nodos.** Si la contraseña tiene símbolos especiales, aplícales URL encoding. Para nuevas pruebas, evita usar contraseñas compartidas en chats.

## API REST
| Método | Ruta | Acceso |
| --- | --- | --- |
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/posts` | Público |
| GET | `/api/posts/:id` | Público |
| POST | `/api/posts` | JWT |
| PUT | `/api/posts/:id` | JWT y propietario |
| DELETE | `/api/posts/:id` | JWT y propietario |
| POST | `/api/posts/:postId/comments` | JWT |
| PUT | `/api/comments/:id` | JWT y propietario |
| DELETE | `/api/comments/:id` | JWT y propietario |

## GitHub
Crea un repositorio público llamado `blog-fullstack-dia38`, sin README inicial. En la raíz del proyecto ejecuta:
```bash
git init
git add .
git commit -m "Entrega Dia 38 blog fullstack"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/blog-fullstack-dia38.git
git push -u origin main
```
Antes del `git add`, confirma que `.env` y `node_modules` **no aparecen** en `git status`.

## Vercel
Importa el **mismo repositorio dos veces** en Vercel:

**Backend:** proyecto `blog-dia38-backend`, Root Directory `backend`, Framework Preset Other. Configura `MONGODB_URI` (o `MONGODB_URI_STANDARD`), `JWT_SECRET` y `CLIENT_URL` (dominio real del frontend). Si Atlas requiere DNS especial, prioriza la URI Standard, no presupongas que los DNS públicos estarán disponibles en el entorno serverless. Comprueba la ruta `/`.

**Frontend:** proyecto `blog-dia38-frontend`, Root Directory `frontend`, Framework Preset Vite, Build Command `npm run build`, Output `dist`. Configura `VITE_API_URL=https://TU-BACKEND.vercel.app/api` **antes del build**. Despliega y vuelve al backend para fijar `CLIENT_URL=https://TU-FRONTEND.vercel.app`; vuelve a desplegar el backend.

## Evidencias y enlaces de entrega
- **GitHub:** pendiente — `https://github.com/TU-USUARIO/blog-fullstack-dia38`
- **Frontend Vercel:** pendiente
- **Backend Vercel:** pendiente
- **Capturas:** incluir portada, registro/login, creación de publicación con imagen, comentarios y edición/eliminación.

> Estado: código generado y revisado estáticamente. Los enlaces reales, pruebas integradas con tu MongoDB y despliegues requieren acceso a tus cuentas; no se presentan como completados.
