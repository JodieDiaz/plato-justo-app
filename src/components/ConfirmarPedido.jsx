"use client"; // Marca este componente como cliente

import React, { useEffect, useState } from "react";
import Modal from "react-modal"; // Asegúrate de tener la dependencia instalada
import { formatPrice } from "@/lib/utils"; // Asegúrate de tener esta función para formatear el precio

const ConfirmarPedido = ({ cartItems, closeModal, clearCart }) => {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [showGif, setShowGif] = useState(false); // Nuevo estado para el GIF

  // Asignar explícitamente el parentSelector al body
  useEffect(() => {
    Modal.setAppElement("body"); // Esto asigna el body como contenedor del modal
  }, []);

  // Función para formatear la cantidad
  const formatQuantity = (fullCount, halfCount) => {
    let quantityDisplay = "";

    if (fullCount > 0) {
      quantityDisplay += `${fullCount} ${
        fullCount === 1 ? "porción completa" : "porciones completas"
      }`;
    }

    if (halfCount > 0) {
      quantityDisplay += `${quantityDisplay ? " más " : ""}${halfCount} ${
        halfCount === 1 ? "media porción" : "medias porciones"
      }`;
    }

    return quantityDisplay;
  };

  // Calcular el total del pedido
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2);
      const remainingHalfCount = item.halfCount % 2;

      const totalFullPrice = item.fullPortionPrice * totalFullCount;
      const totalHalfPrice = item.halfPortionPrice * remainingHalfCount;

      return total + totalFullPrice + totalHalfPrice;
    }, 0);
  };

  // Función para manejar la confirmación del pedido
  const handleConfirm = () => {
    clearCart(); // Vaciar el carrito
    setOrderConfirmed(true); // Marcar que el pedido fue confirmado
    setShowGif(true); // Mostrar el GIF

    // Ocultar el GIF después de 3 segundos y cerrar el modal
    setTimeout(() => {
      setShowGif(false); // Ocultar el GIF
      closeModal(); // Cerrar el modal
    }, 2000);
  };

  return (
    <Modal
      isOpen={true}
      onRequestClose={closeModal} // Cerrar el modal
      contentLabel="Confirmación de Pedido"
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      {orderConfirmed ? (
        <div className="text-center">
          {" "}
          {/* Centramos todo el contenido */}
          <h2 className="text-xl font-semibold">¡Pedido Confirmado!</h2>
          <div className="mt-4 flex justify-center">
            {" "}
            {/* Centrar el GIF horizontalmente */}
            {showGif && ( // Mostrar el GIF solo si showGif es true
              <iframe
                src="https://giphy.com/embed/BPJmthQ3YRwD6QqcVD"
                width="480"
                height="269"
                frameBorder="0"
                className="giphy-embed"
                allowFullScreen
              ></iframe>
            )}
          </div>
          <p className="mt-4">¡Gracias por tu compra!</p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold">Confirmar Pedido</h2>
          <p>¿Quieres realizar este pedido?</p>

          {/* Lista de productos en el carrito */}
          <div className="mt-4">
            {cartItems.length === 0 ? (
              <p>Tu carrito está vacío.</p>
            ) : (
              cartItems.map((item) => {
                const totalFullCount =
                  item.fullCount + Math.floor(item.halfCount / 2);
                const remainingHalfCount = item.halfCount % 2;

                return (
                  <div key={item.id} className="flex justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">
                        {formatQuantity(totalFullCount, remainingHalfCount)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-600">
                        {formatPrice(
                          item.fullPortionPrice * totalFullCount +
                            item.halfPortionPrice * remainingHalfCount
                        )}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Total del pedido */}
          <div className="mt-4">
            <h3 className="text-lg font-bold">Total:</h3>
            <p className="text-xl font-bold">{formatPrice(getTotalPrice())}</p>
          </div>

          {/* Botones de Cancelar y Confirmar */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-black rounded-md p-2 hover:bg-red-500 hover:text-white transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm} // Llamamos a handleConfirm cuando el usuario confirma
              className="bg-black text-white rounded-md p-2 hover:bg-green-500 hover:text-white transition-all"
            >
              Confirmar
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ConfirmarPedido;
