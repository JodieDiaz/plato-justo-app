// src/libs/db.js
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGODB_URI);
let db;

const connectToDatabase = async () => {
  if (!db) {
    try {
      
      await client.connect();
      
      db = client.db("SaborArte"); 
      console.log("Conectado a la base de datos:", db.databaseName);
    } catch (error) {
      console.error("Error conectando a la base de datos:", error);
      throw new Error("Error conectando a la base de datos");
    }
  }
  return { db, client };
};

export default connectToDatabase;
