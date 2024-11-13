import React, { useState } from "react";
import { formatPrice } from "@/lib/utils";
import dynamic from "next/dynamic";
import { useCart } from "@/context/CartContext";

// Importamos el componente de ConfirmarPedido de forma dinámica
const ConfirmarPedido = dynamic(() => import("../components/ConfirmarPedido"), {
  ssr: false,
});

export default function Cart({
  cartItems,
  onRemoveFromCart,
  onUpdateQuantity,
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCartDetails, setModalCartDetails] = useState([]);
  const { clearCart } = useCart();

  // Funciones para abrir y cerrar el modal
  const openModal = () => {
    if (getTotalPrice() === 0) {
      alert("Debes seleccionar algún producto.");
      return;
    }
    setModalCartDetails(cartItems);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const formatQuantity = (fullCount, halfCount) => {
    let quantityDisplay = "";

    if (fullCount > 0) {
      quantityDisplay += `${fullCount} ${
        fullCount === 1 ? "porción completa" : "porciones"
      }`;
    }

    if (halfCount > 0) {
      quantityDisplay += `${quantityDisplay ? " más " : ""}${halfCount} ${
        halfCount === 1 ? "media porción" : "medias porciones"
      }`;
    }


const formatQuantity = (fullCount, halfCount) => {
  let quantityDisplay = "";
  if (fullCount === 1) {
    quantityDisplay += "1 porción completa";
  } else if (fullCount > 1) {
    quantityDisplay += `${fullCount} porciones completas`;
  }
  if (halfCount === 1) {
    quantityDisplay += `${quantityDisplay ? " más " : ""} 1 media porción`;
  } else if (halfCount > 1) {
    quantityDisplay += `${quantityDisplay ? " más " : ""}${halfCount} medias porciones`;
  }
  return quantityDisplay;
};

const Cart = ({
  cartItems = [],
  onRemoveFromCart = () => {},
  onUpdateQuantity = () => {},
  onClearCart = () => {}
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const totalFullCount = item.fullCount + Math.floor(item.halfCount / 2);
      const remainingHalfCount = item.halfCount % 2;
      const totalFullPrice = item.fullPortionPrice * totalFullCount;
      const totalHalfPrice = item.halfPortionPrice * remainingHalfCount;
      return total + totalFullPrice + totalHalfPrice;
    }, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="text-xl font-semibold">Tu Carrito</h2>
      {cartItems.length === 0 ? (
        <p className="text-center text-gray-500">Tu carrito está vacío</p>
      ) : (
        cartItems.map((item) => {
          const totalFullCount =
            item.fullCount + Math.floor(item.halfCount / 2);
          const remainingHalfCount = item.halfCount % 2;

          return (
            <div
              key={item.id}
              className="cart-item flex justify-between items-center mb-4"
            >
              <div className="product-info flex-1">
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  Precio por porción completa:{" "}
                  {formatPrice(item.fullPortionPrice)}
                </p>
                <p className="text-gray-600">
                  Precio por media porción: {formatPrice(item.halfPortionPrice)}
                </p>
                <p className="text-gray-600">
                  {formatQuantity(totalFullCount, remainingHalfCount)}
                </p>
              </div>

              <div className="quantity-controls flex items-center gap-4">
                <div className="flex flex-col items-center">
                  <span>Porción Completa</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, "full", item.fullCount - 1)
                      }
                      className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 transition-colors text-sm"
                      disabled={item.fullCount <= 0}
                    >
                      -
                    </button>
                    <span>{item.fullCount}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, "full", item.fullCount + 1)
                      }
                      className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  <span>Media Porción</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, "half", item.halfCount - 1)
                      }
                      className="bg-red-500 text-white rounded-md px-2 py-1 hover:bg-red-600 transition-colors text-sm"
                      disabled={item.halfCount <= 0}
                    >
                      -
                    </button>
                    <span>{item.halfCount}</span>
                    <button
                      onClick={() =>
                        onUpdateQuantity(item.id, "half", item.halfCount + 1)
                      }
                      className="bg-green-500 text-white rounded-md px-2 py-1 hover:bg-green-600 transition-colors text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveFromCart(item.id)}
                  className="bg-gray-300 text-black rounded p-1 hover:bg-gray-400"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })
      )}

      <div className="total-price">
        <h3 className="text-lg font-bold">Total:</h3>
        <p className="text-xl font-bold">{formatPrice(getTotalPrice())}</p>
      </div>
      <button
        onClick={openModal}
        className="checkout-button bg-black text-white rounded-md p-2 w-full mt-4 hover:bg-blue-500 transition-colors"
      >
        Realizar Pedido
      </button>

      {/* Modal de Confirmación */}
      {isModalOpen && (
        <ConfirmarPedido
          closeModal={closeModal}
          cartItems={modalCartDetails}
          totalPrice={getTotalPrice()}
          clearCart={clearCart}
        />
      )}
    </div>
  );
};

Cart.propTypes = {
  cartItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      fullCount: PropTypes.number.isRequired,
      halfCount: PropTypes.number.isRequired,
      fullPortionPrice: PropTypes.number.isRequired,
      halfPortionPrice: PropTypes.number.isRequired,
    })
  ),
  onRemoveFromCart: PropTypes.func,
  onUpdateQuantity: PropTypes.func,
  onClearCart: PropTypes.func,
};

export default Cart;
