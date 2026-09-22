import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";

import { getDb, ObjectId } from "./db.js";

const app = express();

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error(
    "Falta JWT_SECRET en las variables de entorno del backend."
  );
}

const isProduction = process.env.NODE_ENV === "production";

const allowedOrigins = (
  process.env.CLIENT_ORIGIN || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

/* ---------------------------------
   CONFIGURACIÓN GENERAL
---------------------------------- */

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Origen no permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());

/*
  Ayuda a proteger peticiones realizadas desde
  sitios web que no pertenecen a Organízate.
*/
app.use((req, res, next) => {
  const protectedMethods = [
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
  ];

  if (!protectedMethods.includes(req.method)) {
    return next();
  }

  const origin = req.get("origin");

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      message: "Origen no autorizado",
    });
  }

  next();
});

/* ---------------------------------
   COOKIES Y JWT
---------------------------------- */

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

function createToken(user) {
  return jwt.sign(
    {
      email: user.email,
    },
    JWT_SECRET,
    {
      subject: user._id.toString(),
      expiresIn: "7d",
    }
  );
}

function setAuthCookie(res, token) {
  res.cookie("organizate_session", token, {
    ...baseCookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

/* ---------------------------------
   MIDDLEWARE DE AUTENTICACIÓN
---------------------------------- */

function requireAuth(req, res, next) {
  const token = req.cookies.organizate_session;

  if (!token) {
    return res.status(401).json({
      message: "Debes iniciar sesión",
    });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = {
      id: payload.sub,
      email: payload.email,
    };

    next();
  } catch {
    return res.status(401).json({
      message: "Sesión inválida o expirada",
    });
  }
}

/* ---------------------------------
   RATE LIMIT LOGIN / REGISTRO
---------------------------------- */

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message:
      "Demasiados intentos. Espera unos minutos e inténtalo nuevamente.",
  },
});

/* ---------------------------------
   AUTENTICACIÓN
---------------------------------- */

app.post(
  "/api/auth/register",
  authLimiter,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const cleanEmail = email
        ?.trim()
        .toLowerCase();

      if (!cleanEmail || !password) {
        return res.status(400).json({
          message:
            "Correo y contraseña son obligatorios",
        });
      }

      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(cleanEmail)) {
        return res.status(400).json({
          message: "Introduce un correo válido",
        });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message:
            "La contraseña debe tener al menos 8 caracteres",
        });
      }

      if (password.length > 128) {
        return res.status(400).json({
          message: "La contraseña es demasiado larga",
        });
      }

      const db = await getDb();

      const existingUser = await db
        .collection("users")
        .findOne({
          email: cleanEmail,
        });

      if (existingUser) {
        return res.status(409).json({
          message:
            "Ya existe una cuenta con este correo",
        });
      }

      const passwordHash = await bcrypt.hash(
        password,
        12
      );

      const user = {
        email: cleanEmail,
        passwordHash,
        createdAt: new Date(),
      };

      const result = await db
        .collection("users")
        .insertOne(user);

      const savedUser = {
        ...user,
        _id: result.insertedId,
      };

      const token = createToken(savedUser);

      setAuthCookie(res, token);

      res.status(201).json({
        id: result.insertedId.toString(),
        email: cleanEmail,
      });
    } catch (error) {
      next(error);
    }
  }
);

app.post(
  "/api/auth/login",
  authLimiter,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const cleanEmail = email
        ?.trim()
        .toLowerCase();

      if (!cleanEmail || !password) {
        return res.status(400).json({
          message:
            "Correo y contraseña son obligatorios",
        });
      }

      const db = await getDb();

      const user = await db
        .collection("users")
        .findOne({
          email: cleanEmail,
        });

      if (!user) {
        return res.status(401).json({
          message:
            "Correo o contraseña incorrectos",
        });
      }

      const validPassword =
        await bcrypt.compare(
          password,
          user.passwordHash
        );

      if (!validPassword) {
        return res.status(401).json({
          message:
            "Correo o contraseña incorrectos",
        });
      }

      const token = createToken(user);

      setAuthCookie(res, token);

      res.json({
        id: user._id.toString(),
        email: user.email,
      });
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   USUARIO ACTUAL
---------------------------------- */

app.get(
  "/api/auth/me",
  requireAuth,
  (req, res) => {
    res.json({
      id: req.user.id,
      email: req.user.email,
    });
  }
);

/* ---------------------------------
   LOGOUT
---------------------------------- */

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie(
    "organizate_session",
    baseCookieOptions
  );

  res.status(204).send();
});

/* ---------------------------------
   RUTAS GENERALES
---------------------------------- */

app.get("/", (_req, res) => {
  res.json({
    message: "Organízate API activa",
    endpoints: [
      "/api/health",
      "/api/auth/login",
      "/api/auth/register",
      "/api/tasks",
    ],
  });
});

app.get(
  "/api/health",
  async (_req, res, next) => {
    try {
      await getDb();

      res.json({
        ok: true,
        database: "connected",
      });
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   TODAS LAS RUTAS DE TAREAS
   REQUIEREN AUTENTICACIÓN
---------------------------------- */

app.use("/api/tasks", requireAuth);

/* ---------------------------------
   OBTENER TAREAS
---------------------------------- */

app.get(
  "/api/tasks",
  async (req, res, next) => {
    try {
      const db = await getDb();

      const tasks = await db
        .collection("tasks")
        .find({
          userId: req.user.id,
        })
        .sort({
          createdAt: -1,
        })
        .toArray();

      res.json(tasks);
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   OBTENER UNA TAREA
---------------------------------- */

app.get(
  "/api/tasks/:id",
  async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const db = await getDb();

      const task = await db
        .collection("tasks")
        .findOne({
          _id: new ObjectId(req.params.id),
          userId: req.user.id,
        });

      if (!task) {
        return res.status(404).json({
          message: "Tarea no encontrada",
        });
      }

      res.json(task);
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   CREAR TAREA
---------------------------------- */

app.post(
  "/api/tasks",
  async (req, res, next) => {
    try {
      const { title, description } = req.body;

      if (
        !title?.trim() ||
        !description?.trim()
      ) {
        return res.status(400).json({
          message:
            "Título y descripción son obligatorios",
        });
      }

      if (title.trim().length > 120) {
        return res.status(400).json({
          message:
            "El título no puede superar 120 caracteres",
        });
      }

      if (
        description.trim().length > 2000
      ) {
        return res.status(400).json({
          message:
            "La descripción no puede superar 2000 caracteres",
        });
      }

      const now = new Date();

      const task = {
        title: title.trim(),
        description: description.trim(),
        completed: false,

        // El backend decide el propietario.
        userId: req.user.id,
        userEmail: req.user.email,

        createdAt: now,
        updatedAt: now,
      };

      const db = await getDb();

      const result = await db
        .collection("tasks")
        .insertOne(task);

      res.status(201).json({
        ...task,
        _id: result.insertedId,
      });
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   EDITAR TAREA
---------------------------------- */

app.put(
  "/api/tasks/:id",
  async (req, res, next) => {
    try {
      const {
        title,
        description,
        completed,
      } = req.body;

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      if (
        !title?.trim() ||
        !description?.trim()
      ) {
        return res.status(400).json({
          message: "Datos incompletos",
        });
      }

      const fields = {
        title: title.trim(),
        description: description.trim(),
        updatedAt: new Date(),
      };

      if (typeof completed === "boolean") {
        fields.completed = completed;
      }

      const db = await getDb();

      const result = await db
        .collection("tasks")
        .findOneAndUpdate(
          {
            _id: new ObjectId(
              req.params.id
            ),
            userId: req.user.id,
          },
          {
            $set: fields,
          },
          {
            returnDocument: "after",
          }
        );

      if (!result) {
        return res.status(404).json({
          message: "Tarea no encontrada",
        });
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   COMPLETAR / REABRIR
---------------------------------- */

app.patch(
  "/api/tasks/:id",
  async (req, res, next) => {
    try {
      const { completed } = req.body;

      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      if (typeof completed !== "boolean") {
        return res.status(400).json({
          message:
            "completed debe ser verdadero o falso",
        });
      }

      const db = await getDb();

      const result = await db
        .collection("tasks")
        .findOneAndUpdate(
          {
            _id: new ObjectId(
              req.params.id
            ),
            userId: req.user.id,
          },
          {
            $set: {
              completed,
              updatedAt: new Date(),
            },
          },
          {
            returnDocument: "after",
          }
        );

      if (!result) {
        return res.status(404).json({
          message: "Tarea no encontrada",
        });
      }

      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   ELIMINAR
---------------------------------- */

app.delete(
  "/api/tasks/:id",
  async (req, res, next) => {
    try {
      if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const db = await getDb();

      const result = await db
        .collection("tasks")
        .deleteOne({
          _id: new ObjectId(req.params.id),
          userId: req.user.id,
        });

      if (!result.deletedCount) {
        return res.status(404).json({
          message: "Tarea no encontrada",
        });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
);

/* ---------------------------------
   MANEJO DE ERRORES
---------------------------------- */

app.use((error, _req, res, _next) => {
  console.error(error);

  res.status(500).json({
    message:
      process.env.NODE_ENV === "production"
        ? "Error interno del servidor"
        : error.message ||
          "Error interno del servidor",
  });
});

export default app;