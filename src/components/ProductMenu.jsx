"use client"; // Esto marca el componente como cliente

import React, { useEffect, useState } from "react";
import axios from "axios"; // Importa axios
import MenuCard from "./MenuCard"; // Asegúrate de que la ruta sea correcta
import Cart from "./Cart"; // Asegúrate de que la ruta sea correcta

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Estado para el carrito

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products"); // Usa axios en lugar de fetch
        setProducts(response.data); // Accede a los datos de la respuesta
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);


  const addToCart = (product, portionType) => {
    setCart((currentCart) => {
      const existingItemIndex = currentCart.findIndex(
        (item) => item.id === product._id
      );

      if (existingItemIndex !== -1) {
        const updatedItems = [...currentCart];
        const existingItem = updatedItems[existingItemIndex];

        if (portionType === "full") {
          existingItem.fullCount += 1; // Aumenta la cantidad de porciones completas
        } else {
          existingItem.halfCount += 1; // Aumenta la cantidad de media porción

          // Convertir a porción completa si hay 2 medias porciones
          if (existingItem.halfCount % 2 === 0) {
            existingItem.fullCount += 1; // Aumenta porción completa
            existingItem.halfCount = 0; // Reinicia la media porción
          }
        }

        return updatedItems; // Retorna la lista actualizada del carrito
      } else {
        return [
          ...currentCart,
          {
            id: product._id,
            name: product.name,
            fullPortionPrice: product.fullPortionPrice,
            halfPortionPrice: product.halfPortionPrice,
            fullCount: portionType === "full" ? 1 : 0,
            halfCount: portionType === "half" ? 1 : 0,
          },
        ]; // Añade un nuevo producto al carrito
      }
    });
  };


  // Función para formatear la cantidad
  const formatQuantity = (fullCount, halfCount) => {
    let quantityDisplay = `${fullCount} porciones`;
    if (halfCount > 0) {
      const halfPortion = halfCount / 2;
      quantityDisplay += ` y ${halfPortion}`;
    }
    return quantityDisplay;
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const handleUpdateQuantity = (id, portion, newQuantity) => {
    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id === id) {
          const updatedItem = { ...item };
          if (portion === "full") {
            updatedItem.fullCount = newQuantity;
          } else {
            updatedItem.halfCount = newQuantity;
          }
          return updatedItem;
        }
        return item;
      })
    );
  };

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = (id, portion) => {

    setCart((currentCart) => currentCart.filter((item) => item.id !== id));
  };

  return (
    <div className="flex flex-col lg:flex-row p-4">
      <div className="flex-1">
        <h1 className="text-4xl font-bold mb-4">Menú de Productos</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {products.map((product) => (
            <MenuCard
              key={product._id}
              product={product}
              addToCart={addToCart} // Pasa la función addToCart a MenuCard
              cartItems={cart} // Pasa cartItems a MenuCard si lo necesitas en ese componente
            />
          ))}
        </div>
      </div>

      {/* Carrito en la parte derecha */}
      <div className="mt-8 lg:ml-8 lg:w-1/3">
        <Cart
          cartItems={cart}
          onRemoveFromCart={handleRemoveFromCart} // Pasa la función handleRemoveFromCart
          onUpdateQuantity={handleUpdateQuantity} // Pasa la función handleUpdateQuantity

          formatQuantity={formatQuantity} // Pasa la función para formatear cantidades
        />
      </div>
    </div>
  );
};

export default ProductMenu;
