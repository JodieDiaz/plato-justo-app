import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex items-center justify-between py-16 bg-gray-100">
      <div className="container mx-auto flex flex-col lg:flex-row items-center">
        {/* Texto en el lado izquierdo */}
        <div className="lg:w-1/2 px-6">
          <h1 className="text-4xl font-bold mb-4">Bienvenido a Plato Justo</h1>
          <p className="text-lg text-gray-700 mb-6">
            Tu solución para gestionar el inventario de tu restaurante y reducir
            el desperdicio de alimentos.
          </p>
          <Link href="#about">
            <button className="bg-black text-white px-6 py-3 rounded-full hover:bg-orange-500 transition duration-300">
              Saber Más
            </button>
          </Link>
        </div>

        {/* Imagen en el lado derecho */}
        <div className="lg:w-1/2">
          <Image
            src="/Imagen1.png" // Asegúrate de que esta imagen esté en la carpeta public
            alt="Imagen de plato justo"
            width={300}
            height={200}
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>
    </section>
  );
}
