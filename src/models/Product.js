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
    fullGrams: {
      type: Number,
      required: [true, "Los gramos totales son requeridos"],
      min: [0, "Los gramos no pueden ser menores que 0"],
    },
    fullPortionGrams: {
      type: Number,
      required: [true, "Los gramos por porción completa son requeridos"],
      min: [0, "Los gramos por porción no pueden ser menores que 0"],
    },
    halfPortionGrams: {
      type: Number,
      required: [true, "Los gramos por media porción son requeridos"],
      min: [0, "Los gramos por media porción no pueden ser menores que 0"],
    },
    fullPortionPrice: {
      type: Number,
      required: [true, "El precio por porción completa es requerido"],
      min: [0, "El precio por porción completa no puede ser menor que 0"],
    },
    halfPortionPrice: {
      type: Number,
      required: [true, "El precio por media porción es requerido"],
      min: [0, "El precio por media porción no puede ser menor que 0"],
    },
    fullPrice: {
      type: Number,
      required: [true, "El precio total por porciones completas es requerido"],
      min: [
        0,
        "El precio total por porciones completas no puede ser menor que 0",
      ],
    },
    image: {
      type: String,
      required: [false, "La imagen es opcional"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt
    versionKey: false, // Elimina la propiedad __v
  }
);

// Método para calcular el número de porciones completas
ProductSchema.methods.calculateFullPortions = function () {
  if (this.fullGrams && this.fullPortionGrams) {
    return Math.floor(this.fullGrams / this.fullPortionGrams);
  }
  return 0;
};

// Método para calcular el valor total de las porciones completas
ProductSchema.methods.calculateTotalFullPortionValue = function () {
  const fullPortionsAvailable = this.calculateFullPortions();
  if (fullPortionsAvailable && this.fullPortionPrice) {
    return fullPortionsAvailable * this.fullPortionPrice;
  }
  return 0;
};

// Método para calcular los gramos que sobran
ProductSchema.methods.calculateRemainingGrams = function () {
  const fullPortionsAvailable = this.calculateFullPortions();
  if (fullPortionsAvailable && this.fullPortionGrams) {
    return this.fullGrams - fullPortionsAvailable * this.fullPortionGrams;
  }
  return this.fullGrams; // Si no hay porciones completas, todos los gramos son sobrantes
};

// Método para calcular el precio de media porción
ProductSchema.methods.calculateHalfPortionValue = function () {
  const fullPortionsAvailable = this.calculateFullPortions();
  if (fullPortionsAvailable && this.halfPortionPrice) {
    return fullPortionsAvailable * this.halfPortionPrice;
  }
  return 0;
};

// Crear y exportar el modelo
export default models.Product || model("Product", ProductSchema);
