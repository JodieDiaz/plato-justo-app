"use client"; // Esto marca el componente como cliente

import React, { useEffect, useState } from "react";
import axios from "axios"; // Importa axios
import MenuCard from "./MenuCard"; // Asegúrate de que la ruta sea correcta
import Cart from "./Cart"; // Asegúrate de que la ruta sea correcta
import { useCart } from "@/context/CartContext"; // Importa el contexto
import ConfirmarPedido from "./ConfirmarPedido"; // Importa el componente Modal

const ProductMenu = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart, handleUpdateQuantity, handleRemoveFromCart } =
    useCart(); // Usa el contexto
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar el modal

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

  // Función para formatear la cantidad
  const formatQuantity = (fullCount, halfCount) => {
    let quantityDisplay = `${fullCount} porciones`;
    if (halfCount > 0) {
      const halfPortion = halfCount / 2;
      quantityDisplay += ` y ${halfPortion}`;
    }
    return quantityDisplay;
  };

  // Funciones para abrir y cerrar el modal
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
              openModal={openModal} // Pasa la función openModal a MenuCard
            />
          ))}
        </div>
      </div>

      {/* Carrito en la parte derecha */}
      <div className="mt-8 lg:ml-8 lg:w-1/3">
        <Cart
          cartItems={cart} // Pasa cartItems directamente desde el contexto
          onRemoveFromCart={handleRemoveFromCart} // Usa la función de eliminación del contexto
          onUpdateQuantity={handleUpdateQuantity} // Usa la función de actualización del contexto
          formatQuantity={formatQuantity} // Pasa la función para formatear cantidades
        />
      </div>

      {/* Renderizar el modal si está abierto */}
      {isModalOpen && <ConfirmarPedido closeModal={closeModal} />}
    </div>
  );
};

export default ProductMenu;
