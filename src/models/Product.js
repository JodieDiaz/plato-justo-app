// models/Product.js
import { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del producto es requerido"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "La descripción es requerida"],
      trim: true,
      maxlength: [200, "La descripción no puede tener más de 200 caracteres"],
    },
    price: {
      type: Number,
      required: [true, "El precio es requerido"],
      min: [0, "El precio no puede ser menor que 0"],
    },
    portions: {
      type: Number,
      required: [true, "Las porciones son requeridas"],
      min: [1, "Debe haber al menos una porción"],
    },
    grams: {
      type: Number,
      required: [true, "Los gramos son requeridos"],
      min: [0, "Los gramos no pueden ser menores que 0"],
    },
    pricePerPortion: {
      type: Number,
      required: [true, "El precio por porción es requerido"],
      min: [0, "El precio por porción no puede ser menor que 0"],
    },
    image: {
      type: String,
      required: [false, "La imagen es requerida"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
    versionKey: false, // Elimina la propiedad __v
  }
);

// Método para calcular porciones
ProductSchema.methods.calculatePortions = function () {
  if (this.grams && this.portions) {
    return Math.floor(this.grams / this.portions);
  }
  return 0;
};

// Método para calcular el valor total
ProductSchema.methods.calculateTotalValue = function () {
  const portionsAvailable = this.calculatePortions();
  if (portionsAvailable && this.pricePerPortion) {
    return portionsAvailable * this.pricePerPortion;
  }
  return 0;
};

// Crear y exportar el modelo
export default models.Product || model("Product", ProductSchema);
