import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combina clases utilizando clsx y tailwind-merge
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Formatea precios en formato de moneda
export const formatPrice = (price) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(price);
};
