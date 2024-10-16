"use client"; // Asegúrate de incluir esta línea

import { useEffect, useState } from "react"; // Importa useState para manejar el estado
import { useRouter } from "next/navigation"; // Importación para Next.js 13+

const ProductList = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar productos
  const [loading, setLoading] = useState(true); // Estado para manejar la carga
  const [error, setError] = useState(null); // Estado para manejar errores
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/products");

        if (response.ok) {
          const data = await response.json(); // Convertir la respuesta a JSON
          setProducts(data); // Guardar los productos en el estado
        } else {
          console.error("Error al obtener productos:", response.statusText);
          setError("No se pudieron cargar los productos.");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        setError("Ocurrió un error al cargar los productos.");
      } finally {
        setLoading(false); // Cambia el estado de carga al finalizar
      }
    };

    fetchProducts();
  }, [router]);

  const handleEdit = (id) => {
    // Lógica para editar el producto, por ejemplo, redirigir a una página de edición
    router.push(`/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    // Lógica para eliminar el producto
    const confirmed = confirm(
      "¿Estás seguro de que quieres eliminar este producto?"
    );
    if (confirmed) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          // Filtrar el producto eliminado de la lista
          setProducts(products.filter((product) => product._id !== id));
        } else {
          console.error("Error al eliminar producto:", response.statusText);
          alert("No se pudo eliminar el producto.");
        }
      } catch (error) {
        console.error("Error al realizar la solicitud:", error);
        alert("Ocurrió un error al eliminar el producto.");
      }
    }
  };

  if (loading) {
    return <h1>Cargando productos...</h1>; // Mensaje de carga
  }

  if (error) {
    return <h1>{error}</h1>; // Mensaje de error si hay uno
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Lista de Productos
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((product) => {
          const pricePerPortion = Number(product.pricePerPortion); // Asegúrate de que sea un número
          const portionsAvailable = Math.floor(
            product.grams / product.portions
          );
          const totalPrice = portionsAvailable * pricePerPortion; // Calcula el precio total

          // Formatea la fecha de creación
          const createdAt = new Date(product.createdAt).toLocaleDateString(
            "es-CO",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
            }
          );

          return (
            <div key={product._id} className="border rounded-lg p-4 shadow-lg">
              <h2 className="text-xl font-semibold">{product.name}</h2>
              <p>Descripción: {product.description}</p>
              <p>
                Gramos: {product.grams}{" "}
                <span className="text-gray-600">gramos en total</span>
              </p>
              <p>
                Porción: {product.portions}{" "}
                <span className="text-gray-600">Gramos por porción</span>
              </p>
              <p>Precio por porción: ${Math.round(pricePerPortion)}</p>
              <p>Precio Total: ${Math.round(totalPrice)}</p>
              <p>Fecha de Creación: {createdAt}</p>{" "}
              {/* Muestra la fecha de creación */}
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
              )}
              <div className="flex justify-between">
                <button
                  onClick={() => handleEdit(product._id)}
                  className="bg-blue-500 text-white rounded px-2 py-1"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(product._id)}
                  className="bg-red-500 text-white rounded px-2 py-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
