import React from "react";
import { Button } from "@/components/ui/button";

const CardProduct = ({ product, addToCart }) => {
  const pricePerPortion = Number(product.pricePerPortion);
  const portionsAvailable = Math.floor(product.grams / product.portions);
  const pricePerHalfPortion = pricePerPortion / 2;

  const gramsPerPortion = product.grams / product.portions;
  const gramsPerHalfPortion = gramsPerPortion / 2;

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg text-center transition-all hover:bg-gray-300">
      <div className="relative w-[100px] h-[100px] mx-auto mb-4">
        <img
          src={product.image}
          alt={product.name}
          style={{ objectFit: "contain" }}
          className="w-full h-full"
        />
      </div>
      <h4 className="font-semibold my-2">{product.name}</h4>
      <p className="mb-2 text-gray-600">{product.description}</p>
      <div className="mb-4">
        <p className="font-bold text-lg">
          Precio por porción completa: $
          {formatPrice(Math.round(pricePerPortion))}
        </p>
        <p className="font-bold text-lg">
          Precio por media porción: $
          {formatPrice(Math.round(pricePerHalfPortion))}
        </p>
      </div>
      <div className="flex justify-center">
        <Button
          onClick={() => addToCart(product, "full")}
          className="bg-black text-white rounded-full px-4 py-2 mr-2 transition-colors hover:bg-orange-500"
          disabled={portionsAvailable < 1}
        >
          Elegir Porción Completa ({Math.round(gramsPerPortion)}g)
        </Button>
        <Button
          onClick={() => addToCart(product, "half")}
          className="bg-black text-white rounded-full px-4 py-2 transition-colors hover:bg-orange-500"
          disabled={portionsAvailable < 2}
        >
          Elegir Media Porción ({Math.round(gramsPerHalfPortion)}g)
        </Button>
      </div>
    </div>
  );
};

export default CardProduct;
