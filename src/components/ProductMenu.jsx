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

  const addToCart = (product, portion) => {
    setCart((currentCart) => {
      // Verifica si el producto ya existe en el carrito con la porción seleccionada
      const existingItem = currentCart.find(
        (item) => item.id === product._id && item.portion === portion
      );

      if (existingItem) {
        // Si ya existe, incrementa la cantidad del artículo en el carrito
        return currentCart.map((item) =>
          item.id === product._id && item.portion === portion
            ? { ...item, quantity: item.quantity + 1 } // Incrementa la cantidad
            : item
        );
      }

      // Si no existe, agrega el nuevo producto al carrito
      return [
        ...currentCart,
        { ...product, quantity: 1, portion }, // Establece la cantidad inicial en 1
      ];
    });
  };

  // Función para actualizar la cantidad de un producto en el carrito
  const handleUpdateQuantity = (id, portion, newQuantity) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id && item.portion === portion
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  // Función para eliminar un producto del carrito
  const handleRemoveFromCart = (id, portion) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => !(item.id === id && item.portion === portion)
      )
    );
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
        />
      </div>
    </div>
  );
};

export default ProductMenu;
