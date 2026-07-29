# PEC 3 · API REST Geinomi

API RESTful para **Geinomi**, una tienda online de productos outdoor, mochilas, bolsas, camping, senderismo y accesorios de montaña.

El proyecto parte de la base de datos creada en la PEC 2 en MongoDB Atlas, donde se trabajaron cinco colecciones:

- `users`
- `categories`
- `products`
- `orders`
- `reviews`

La entidad principal del CRUD es `products`, pero también se incluyen modelos, rutas y controladores para las demás colecciones para mantener coherencia con la base de datos de la PEC 2.

## Tecnologías usadas

- Node.js
- Express
- MongoDB Atlas
- Mongoose
- Dotenv
- CORS
- Helmet
- Morgan
- Winston
- Nodemon
- Vercel

## Estructura del proyecto

```txt
PEC3_Geinomi_API_REST/
├── api/
│   └── index.js
├── data/
│   ├── users.sample.json
│   ├── categories.sample.json
│   ├── products.sample.json
│   ├── orders.sample.json
│   └── reviews.sample.json
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/logger.js
│   └── app.js
├── .env.example
├── .gitignore
├── geinomi.postman_collection.json
├── package.json
├── requests.http
├── server.js
└── vercel.json
```

## Modelos creados

### User

Representa los usuarios de la aplicación.

- `name`: String, obligatorio.
- `email`: String, obligatorio y único.
- `password`: String, obligatorio.
- `role`: String, puede ser `admin`, `customer` o `editor`.
- `isActive`: Boolean.

### Category

Representa las categorías del catálogo.

- `name`: String, obligatorio.
- `slug`: String, obligatorio y único.
- `description`: String, obligatorio.
- `isActive`: Boolean.

### Product

Representa los productos outdoor del catálogo de Geinomi.

- `name`: String, obligatorio.
- `description`: String, obligatorio.
- `category`: String, obligatorio.
- `price`: Number, obligatorio.
- `stock`: Number, obligatorio.
- `capacity`: String.
- `weight`: String.
- `material`: String.
- `color`: String.
- `image`: String.
- `status`: String.
- `featured`: Boolean.
- `createdBy`: String.

### Order

Representa los pedidos de los clientes.

- `userEmail`: String, obligatorio.
- `items`: Array de productos comprados.
- `total`: Number, obligatorio.
- `status`: String.
- `shippingAddress`: Object.
- `paymentMethod`: String.

### Review

Representa las reseñas de productos.

- `productName`: String, obligatorio.
- `userEmail`: String, obligatorio.
- `rating`: Number, obligatorio.
- `comment`: String, obligatorio.
- `isPublished`: Boolean.

## Endpoints principales

### General

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Mensaje de bienvenida |
| GET | `/api` | Información general de la API |

### Products

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Obtener todos los productos |
| GET | `/api/products/:id` | Obtener un producto por ID |
| POST | `/api/products` | Crear un producto |
| PUT | `/api/products/:id` | Actualizar un producto |
| DELETE | `/api/products/:id` | Eliminar un producto |

### Users, Categories, Orders y Reviews

Cada una de estas colecciones también tiene rutas CRUD completas con la misma estructura:

```txt
GET    /api/nombre-coleccion
GET    /api/nombre-coleccion/:id
POST   /api/nombre-coleccion
PUT    /api/nombre-coleccion/:id
DELETE /api/nombre-coleccion/:id
```

Ejemplos:

- `/api/users`
- `/api/categories`
- `/api/orders`
- `/api/reviews`

## Instalación y ejecución local

1. Instalar dependencias:

```bash
npm install
```

2. Crear un archivo `.env` usando `.env.example` como referencia:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=mongodb+srv://geinomi_user:TU_CONTRASEÑA@clustergeinomi.yqc9vdp.mongodb.net/geinomi_db?retryWrites=true&w=majority&appName=ClusterGeinomi
JWT_SECRET=geinomi_secret_key_demo
```

3. Ejecutar en modo desarrollo:

```bash
npm run dev
```

4. Abrir en el navegador:

```txt
http://localhost:4000
```

## Variables de entorno necesarias

| Variable | Descripción |
|---|---|
| `PORT` | Puerto local del servidor |
| `NODE_ENV` | Entorno de ejecución |
| `MONGODB_URI` | Cadena de conexión de MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para futuras autenticaciones |

## Pruebas de la API

Se incluyen dos archivos obligatorios de pruebas:

- `requests.http`: pruebas para REST Client o Thunder Client en VS Code.
- `geinomi.postman_collection.json`: colección para importar en Postman.

## Despliegue en Vercel

1. Subir el proyecto a GitHub.
2. Entrar en Vercel y crear un nuevo proyecto desde el repositorio.
3. Configurar la variable de entorno `MONGODB_URI`.
4. Desplegar el proyecto.
5. Probar la URL desplegada, por ejemplo:

```txt
https://tu-proyecto.vercel.app/api/products
```

## Diagrama Mermaid

```mermaid
flowchart TD
    A[Cliente / Postman / Navegador] --> B[Express App]
    B --> C[Router /api]
    C --> D[Product Routes]
    C --> E[User Routes]
    C --> F[Category Routes]
    C --> G[Order Routes]
    C --> H[Review Routes]

    D --> I[Product Controller]
    E --> J[User Controller]
    F --> K[Category Controller]
    G --> L[Order Controller]
    H --> M[Review Controller]

    I --> N[Product Model]
    J --> O[User Model]
    K --> P[Category Model]
    L --> Q[Order Model]
    M --> R[Review Model]

    N --> S[(MongoDB Atlas)]
    O --> S
    P --> S
    Q --> S
    R --> S

    B --> T[Middleware 404]
    B --> U[Middleware 500]
```

## Respuestas JSON

Todas las respuestas correctas siguen una estructura clara:

```json
{
  "status": "success",
  "results": 4,
  "data": []
}
```

Los errores también responden en JSON:

```json
{
  "status": "error",
  "statusCode": 404,
  "message": "Ruta no encontrada"
}
```

## Seguridad

El archivo `.env` no debe subirse a GitHub. Solo se incluye `.env.example` para mostrar qué variables son necesarias.
