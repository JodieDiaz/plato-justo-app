"use client"; // Esto marca el componente como cliente

import React, { useState } from "react";
import ProductMenu from "@/components/ProductMenu";
import ConfirmarPedido from "@/components/ConfirmarPedido"; // Importa el modal

const MenuPage = () => {
  const [isModalOpen, setModalOpen] = useState(false); // Estado para controlar la apertura del modal

  // Funciones para abrir y cerrar el modal
  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  return (
    <div>
      <ProductMenu openModal={openModal} />{" "}
      {/* Pasa la función openModal al componente de menú */}
      {/* Condición para renderizar el modal solo cuando está abierto */}
      {isModalOpen && <ConfirmarPedido closeModal={closeModal} />}
    </div>
  );
};

export default MenuPage;
