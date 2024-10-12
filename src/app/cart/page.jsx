// src/app/cart/page.jsx

import React from "react";
import Cart3 from "../../components/Cart3";

const CartPage = () => {
  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center text-black mb-6 shadow-lg p-4 rounded-md bg-white border border-gray-300">
        Plato Justo
      </h1>
      <Cart3 />
    </div>
  );
};

export default CartPage;
