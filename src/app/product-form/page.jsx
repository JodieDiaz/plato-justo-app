"use client";

import ProductForm from "../../components/ProductForm"; 
import "../globals.css";

const AdminProducts = () => {
  return (
    <div className="admin-page">
      {/* Contenedor del título */}
      <div className="header-container">
        <h1 className="text-center text-3xl font-bold mb-8">
          Gestionar Productos
        </h1>
      </div>

      {/* Contenedor del formulario */}
      <div className="form-container flex justify-center items-center">
        <ProductForm />
      </div>
    </div>
  );
};

export default AdminProducts;
