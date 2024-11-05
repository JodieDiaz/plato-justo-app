// models/Users.js
import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    role: {
      type: String,
      required: [true, "Administrador o Cliente"],
      trim: true,
    },
    firstname: {
      type: String,
      required: [true, "Nombres son requeridos"],
      trim: true,
    },
    secondname: {
      type: String,
      required: [true, "Apellidos son requeridos"],
      trim: true,
    },
    doctype: {
      type: String,
      required: [true, "Tipo de documento (CC, CE, TI) es requerido"],
      trim: true,
    },
    docnum: {
      type: Number,
      required: [true, "Número de documento es requerido"],
    },
    email: {
      type: String,
      required: [true, "Correo electrónico es requerido"],
      trim: true,
    },
    phone: {
      type: Number,
      required: [true, "Número de teléfono es requerido"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
    versionKey: false, // Elimina la propiedad __v
  }
);

// Crear y exportar el modelo
export default models.Users || model("Users", UserSchema);
