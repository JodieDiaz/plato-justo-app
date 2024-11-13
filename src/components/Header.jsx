// src/components/Header.jsx
import Link from "next/link";

export default function Header() {
  return (
    <header>
      {/* Navbar */}
      <nav className="bg-black text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="text-4xl font-bold hover:text-orange-300">
            Plato Justo
          </Link>
          <div className="space-x-4">
            <Link href="#about" className="hover:text-orange-300">
              ¿Quiénes Somos?
            </Link>
            <Link href="#features" className="hover:text-orange-300">
              ¿Cómo Funciona?
            </Link>
            <Link href="#contact" className="hover:text-orange-300">
              Contáctanos
            </Link>
          </div>
          <Link href="#login" className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition duration-300">
            Iniciar Sesión
          </Link>
        </div>
      </nav>
    </header>
  );
}
