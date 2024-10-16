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
    portions: "",
    grams: "",
    pricePerPortion: "",
    price: "",
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
        formDataCloudinary.append(
          "upload_preset",
          "unsigned_preset_plato_justo"
        );

        const response = await axios.post(
          `https://api.cloudinary.com/v1_1/dl1ixv30n/image/upload`, // Reemplaza por tu Cloudinary cloud_name
          formDataCloudinary
        );
        imageUrl = response.data.secure_url;
      }

      // Preparar los datos a enviar
      const data = {
        ...formData,
        image: imageUrl, // Usar la URL de la imagen subida
      };

      if (!params.id) {
        await axios.post("/api/products", data);
      } else {
        await axios.put(`/api/products/${params.id}`, data);
      }

      router.push("/admin");
    } catch (error) {
      console.error("Error al enviar el formulario:", error);
    }
  };

  const calculatePortions = () => {
    const gramsAvailable = parseFloat(formData.grams);
    const gramsPerPortion = parseFloat(formData.portions);
    if (gramsAvailable && gramsPerPortion) {
      return Math.floor(gramsAvailable / gramsPerPortion);
    }
    return 0;
  };

  const calculateTotalValue = () => {
    const portionsAvailable = calculatePortions();
    const pricePerPortion = parseFloat(formData.pricePerPortion);
    if (portionsAvailable && pricePerPortion) {
      return portionsAvailable * pricePerPortion;
    }
    return 0;
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

        <label className="block text-black font-bold mb-2" htmlFor="grams">
          Gramos Disponibles
        </label>
        <input
          type="number"
          name="grams"
          value={formData.grams}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-black font-bold mb-2" htmlFor="portions">
          Gramos por Porción
        </label>
        <input
          type="number"
          name="portions"
          value={formData.portions}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label
          className="block text-black font-bold mb-2"
          htmlFor="pricePerPortion"
        >
          Precio por Porción
        </label>
        <input
          type="number"
          name="pricePerPortion"
          value={formData.pricePerPortion}
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />

        <label className="block text-black font-bold mb-2" htmlFor="image">
          Imagen
        </label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="border border-gray-300 rounded w-full py-2 px-3 mb-4 bg-gray-50 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {imagePreview && (
          <div className="mt-4">
            <h3 className="text-black font-bold">Vista previa de la imagen:</h3>
            <img
              src={imagePreview}
              alt="Vista previa"
              className="w-full h-auto border border-gray-300 rounded mt-2"
            />
          </div>
        )}

        <div className="mt-4 text-black">
          <p>Cantidad de Porciones Disponibles: {calculatePortions()}</p>
          <p>Valor Total: ${calculateTotalValue().toFixed(2)}</p>
        </div>

        <button
          type="submit"
          className="bg-black text-white font-bold py-2 px-4 rounded w-full mt-4 hover:bg-orange-500 transition-colors duration-300"
        >
          {params.id ? "Actualizar" : "Crear"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;
