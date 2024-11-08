import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('defina MONGODB_URI');
}

if (!MONGODB_DB) {
  throw new Error('defina MONGODB_DB');
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  // reutilizamos la conexion
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Si no hay conexión, se crea nueva
  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}