"use client"; // Indica que este es un Client Component

import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductListCard from "../../components/ListCard";

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/products`;
        const response = await axios.get(apiUrl);

        // Asegúrate de que la respuesta es un array
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else {
          throw new Error("Datos de productos no son un array");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Falló la carga de productos. Inténtalo de nuevo más tarde.");
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <p>{error}</p>; // Muestra el error si ocurre
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      {products.map((product) => (
        <ProductListCard key={product._id} product={product} />
      ))}
    </div>
  );
};

export default ProductListPage;
