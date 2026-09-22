import dns from "node:dns";
import { MongoClient, ObjectId } from "mongodb";

// Solución para equipos donde Node no resuelve correctamente
// los registros SRV de MongoDB Atlas.
if (process.env.DNS_SERVERS) {
  const servers = process.env.DNS_SERVERS
    .split(",")
    .map((server) => server.trim())
    .filter(Boolean);

  dns.setServers(servers);
}

let client;
let db;

export async function getDb() {
  if (db) return db;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error(
      "Falta MONGODB_URI en las variables de entorno del servidor."
    );
  }

  client = client || new MongoClient(uri);

  await client.connect();

  db = client.db(process.env.MONGODB_DB_NAME || "tareasdb");

  await db
    .collection("tasks")
    .createIndex({ userId: 1, createdAt: -1 });
    
    await db.collection("users").createIndex(
  { email: 1 },
  { unique: true }
);

  return db;
}

export { ObjectId };