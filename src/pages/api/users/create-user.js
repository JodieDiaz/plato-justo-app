import clientPromise from "../../../libs/db_users"; // Importación correcta
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { role, firstname, secondname, doctype, docnum, countryCode, phone, email, password } = req.body;

    try {
      // Conectar a la base de datos
      const client = await clientPromise; // Obtener el cliente MongoDB
      const db = client.db(); // Seleccionar la base de datos
      const collection = db.collection("users");

      // Verificar si el usuario ya existe
      const existingUser = await collection.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "El usuario ya existe" });
      }

      // Encriptar la contraseña antes de guardarla
      const hashedPassword = await bcrypt.hash(password, 10);

      // Crear el usuario en la base de datos
      const result = await collection.insertOne({
        role,
        firstname,
        secondname,
        doctype,
        docnum,
        countryCode,
        phone,
        email,
        password: hashedPassword,
      });

      return res.status(201).json({ message: "Usuario creado exitosamente", userId: result.insertedId });
    } catch (error) {
      console.error("Error al crear usuario:", error);
      return res.status(500).json({ message: "Error al crear usuario" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
