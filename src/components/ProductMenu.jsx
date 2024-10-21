"use client"; // Asegúrate de que este componente esté marcado como cliente

import React, { useEffect, useState } from "react";
import CardProduct from "./CardProduct"; // Asegúrate de que la ruta sea correcta
import Cart from "./Cart"; // Asegúrate de que la ruta sea correcta

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]); // Estado para el carrito

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products"); // Cambia esto si es necesario
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Función para agregar productos al carrito
  const addToCart = (product, portion) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (item) => item.id === product._id && item.portion === portion
      );
      if (existingItem) {
        // Si ya existe, actualiza la cantidad
        return currentCart.map((item) =>
          item.id === product._id && item.portion === portion
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Si no existe, añade un nuevo producto al carrito
      return [...currentCart, { ...product, quantity: 1, portion }];
    });
  };

  // Función para eliminar productos del carrito
  const handleRemoveFromCart = (id, portion) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id || item.portion !== portion)
    );
  };

  // Función para actualizar la cantidad de productos en el carrito
  const handleUpdateQuantity = (id, portion, quantity) => {
    if (quantity < 1) {
      handleRemoveFromCart(id, portion);
    } else {
      setCart((currentCart) =>
        currentCart.map((item) =>
          item.id === id && item.portion === portion
            ? { ...item, quantity }
            : item
        )
      );
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold mb-4">Menú de Productos</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => (
          <CardProduct
            key={product._id}
            product={product}
            addToCart={addToCart} // Pasa la función addToCart a CardProduct
          />
        ))}
      </div>

      {/* Aquí puedes agregar el componente de carrito */}
      <div className="mt-8">
        <Cart
          cartItems={cart}
          onRemoveFromCart={handleRemoveFromCart}
          onUpdateQuantity={handleUpdateQuantity}
        />
      </div>
    </div>
  );
};

export default ProductMenu;
