"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";

function ProductForm() {
  const router = useRouter();
  const params = useParams();
  const form = useRef(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    fullGrams: "", // Gramos totales
    fullPortionGrams: "", // Gramos por porción completa
    halfPortionGrams: "", // Gramos por media porción (nuevo campo)
    fullPortionPrice: "", // Precio por porción completa
    halfPortionPrice: "", // Precio por media porción (editable)
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (params.id) {
        const response = await axios.get(`/api/products/${params.id}`);
        setFormData(response.data);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleChange = (e) => {
    const target = e.target;

    if (target instanceof HTMLInputElement) {
      const { name, value, files } = target;

      if (name === "image" && files && files.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          [name]: files[0],
        }));

        const previewUrl = URL.createObjectURL(files[0]);
        setImagePreview(previewUrl);
      } else {
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else if (target instanceof HTMLTextAreaElement) {
      const { name, value } = target;

      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    let imageUrl = uploadedImageUrl;

    // Subir la imagen a Cloudinary si es nueva
    if (formData.image && typeof formData.image !== "string") {
      const formDataCloudinary = new FormData();
      formDataCloudinary.append("file", formData.image);
      formDataCloudinary.append("upload_preset", "unsigned_preset_plato_justo");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dl1ixv30n/image/upload", // Reemplaza por tu Cloudinary cloud_name
        formDataCloudinary
      );
      imageUrl = response.data.secure_url;
    }

    // Calcular los precios si no están establecidos
    const fullPortionPrice = parseFloat(formData.fullPortionPrice);
    const halfPortionPrice =
      parseFloat(formData.halfPortionPrice) || fullPortionPrice / 2; // Si no se ingresa, se calcula como la mitad
    const totalPortions = calculatePortions(); // Total de porciones completas
    const fullPrice = fullPortionPrice * totalPortions; // Precio total por porciones completas

    // Aquí asegúrate de calcular halfPortionGrams
    const halfPortionGrams = calculateHalfPortionGrams(); // Asegúrate de implementar esta función para obtener el valor correcto.

    // Preparar los datos a enviar
    const data = {
      ...formData,
      image: imageUrl, // Usar la URL de la imagen subida
      halfPortionPrice: halfPortionPrice,
      fullPrice: fullPrice,
      totalPortions: totalPortions, // Agregar total de porciones completas
      remainingGrams: calculateRemainingGrams(), // Gramos restantes
      halfPortionGrams: halfPortionGrams, // Asegúrate de incluir halfPortionGrams aquí
    };

    // Enviar los datos a la API
    if (!params.id) {
      await axios.post("/api/products", data);
    } else {
      await axios.put(`/api/products/${params.id}`, data);
    }

    // Cambiar la ruta de redirección
    router.push("/product-list");
  } catch (error) {
    console.error("Error al enviar el formulario:", error);
  }
};

  // Calcula los gramos por media porción
  const calculateHalfPortionGrams = () => {
    const fullPortionGrams = parseFloat(formData.fullPortionGrams);
    return fullPortionGrams ? fullPortionGrams / 2 : 0;
  };

  // Calcula el número de porciones completas disponibles
  const calculatePortions = () => {
    const fullGrams = parseFloat(formData.fullGrams);
    const fullPortionGrams = parseFloat(formData.fullPortionGrams);
    return fullPortionGrams ? Math.floor(fullGrams / fullPortionGrams) : 0;
  };

  // Calcula los gramos restantes
  const calculateRemainingGrams = () => {
    const fullGrams = parseFloat(formData.fullGrams);
    const fullPortionGrams = parseFloat(formData.fullPortionGrams);
    const totalPortions = calculatePortions();
    return fullGrams - totalPortions * fullPortionGrams || 0;
  };

  // Calcula el precio total del producto
  const calculateTotalPrice = () => {
    const fullPortionPrice = parseFloat(formData.fullPortionPrice);
    const totalPortions = calculatePortions(); // Número de porciones
    return fullPortionPrice * totalPortions || 0;
  };

  // Formatea los números con punto como separador de miles y sin decimales
  const formatNumber = (num) => {
    return Math.floor(num)
      .toString()
      .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  return (
    <div className="flex justify-center items-center min-h-screen w-full">
      <form
        className="justify-center items-center bg-white shadow-md rounded-md px-8 pt-6 pb-8 mb-4 w-full max-w-md"
        onSubmit={handleSubmit}
        ref={form}
      >
        <h2 className="text-lg font-bold mb-4 text-center text-black">
          {params.id ? "Actualizar Producto" : "Crear Producto"}
        </h2>

        {/* Campos del formulario */}
        <label className="block text-black font-bold mb-2" htmlFor="name">
          Nombre del Producto
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="description"
        >
          Descripción
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          required
        />

        <label className="block text-black font-bold mb-2" htmlFor="fullGrams">
          Gramos Totales
        </label>
        <input
          type="number"
          name="fullGrams"
          value={formData.fullGrams}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="fullPortionGrams"
        >
          Gramos por Porción Completa
        </label>
        <input
          type="number"
          name="fullPortionGrams"
          value={formData.fullPortionGrams}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="halfPortionGrams"
        >
          Gramos por Media Porción
        </label>
        <input
          type="number"
          name="halfPortionGrams"
          value={calculateHalfPortionGrams()} // Calculamos y mostramos los gramos por media porción
          readOnly
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="fullPortionPrice"
        >
          Precio por Porción Completa
        </label>
        <input
          type="number"
          name="fullPortionPrice"
          value={formData.fullPortionPrice}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="halfPortionPrice"
        >
          Precio por Media Porción
        </label>
        <input
          type="number"
          name="halfPortionPrice"
          value={formData.halfPortionPrice} // Campo editable
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        {/* Sección para mostrar Porciones Completas Disponibles */}
        <div className="text-black font-bold mb-2">
          Porciones Completas Disponibles: {calculatePortions()}
        </div>

        {/* Sección para mostrar Gramos Restantes */}
        <div className="text-black font-bold mb-2">
          Gramos Restantes: {calculateRemainingGrams()}
        </div>

        {/* Sección para mostrar Precio Total */}
        <div className="text-black font-bold mb-2">
          Precio Total: ${formatNumber(calculateTotalPrice())}
        </div>

        {/* Sección para subir la imagen */}
        <label className="block text-black font-bold mb-2" htmlFor="image">
          Imagen del Producto
        </label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-32 h-32 object-cover mb-4"
          />
        )}

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
        >
          {params.id ? "Actualizar Producto" : "Crear Producto"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
