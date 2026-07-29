# Express Router: CRUD con archivos CSV

Solución de los tres niveles del ejercicio. La API administra `person` y `classroom`, guarda la información en dos CSV y usa `Express.Router()`.

## Instalación

Requiere Node.js 18 o superior.

```bash
npm install
npm start
```

Servidor: `http://localhost:3000`

## Endpoints de personas

| Método | Ruta | Acción |
|---|---|---|
| POST | `/api/persons` | Crear |
| GET | `/api/persons` | Listar y buscar |
| GET | `/api/persons/:id` | Leer una persona |
| PUT | `/api/persons/:id` | Actualizar |
| DELETE | `/api/persons/:id` | Borrar |

Filtros disponibles: `id`, `name`, `surname`, `isTeacher` y `birthdate`.

Ejemplo: `/api/persons?name=ana&surname=garcía`

```json
{
  "name": "Pedro",
  "surname": "López",
  "isTeacher": false,
  "birthdate": "2003-04-15"
}
```

El `id` es opcional al crear. Si se omite, el servidor calcula el siguiente; si se envía repetido, responde con `409 Conflict`.

## Endpoints de aulas

| Método | Ruta | Acción |
|---|---|---|
| POST | `/api/classrooms` | Crear |
| GET | `/api/classrooms` | Listar y buscar |
| GET | `/api/classrooms/:id` | Leer un aula |
| PUT | `/api/classrooms/:id` | Actualizar |
| DELETE | `/api/classrooms/:id` | Borrar |
| GET | `/api/classrooms/:id/full` | Ver un aula con datos completos |
| GET | `/api/classrooms/full` | Listar todas con datos completos |

Filtros disponibles: `id`, `name`, `teacher_id` y `student_id`.

Ejemplo: `/api/classrooms?name=programación&teacher_id=1`

```json
{
  "name": "Desarrollo web",
  "teacher_id": "1",
  "students": ["2", "3"]
}
```

El servidor verifica que el profesor y cada estudiante existan. Además, la persona asignada como profesor debe tener `isTeacher: true`.

## Pruebas rápidas con curl

```bash
curl http://localhost:3000/api/persons
curl "http://localhost:3000/api/persons?name=ana&surname=garcía"
curl http://localhost:3000/api/classrooms/full
curl http://localhost:3000/api/classrooms/1/full
```

Crear una persona:

```bash
curl -X POST http://localhost:3000/api/persons \
  -H "Content-Type: application/json" \
  -d '{"name":"Pedro","surname":"López","isTeacher":false,"birthdate":"2003-04-15"}'
```

Actualizar una persona:

```bash
curl -X PUT http://localhost:3000/api/persons/2 \
  -H "Content-Type: application/json" \
  -d '{"surname":"Pérez Gómez"}'
```

Ejecutar pruebas automáticas:

```bash
npm test
```

## Estructura

```text
express-router-csv/
├── data/
│   ├── classrooms.csv
│   └── persons.csv
├── src/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── app.js
├── test/
├── package.json
└── README.md
```
