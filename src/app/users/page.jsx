// src/app/user/page.jsx

"use client";

import "../globals.css";
import Image from "next/image";
import Header from "../../components/Header"; // Asegúrate de la ruta correcta
import Hero from "../../components/Hero"; // Asegúrate de la ruta correcta
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import UserForm from "../../components/UserForm"; // Importación de UserForm

function UserPage({ user }) {
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  return (
    <div>
      <Header /> {/* Incluimos Header */}
      <Hero /> {/* Incluimos Hero, si es relevante */}
      
      {/* Sign Up Section */}
      <section id="register" className="py-16 bg-gray-100">
        <div className="container mx-auto text-center">
          <h3 className="text-4xl font-bold mb-8">Registro</h3>
          <UserForm mode="user" /> {/* Renderizamos UserForm en modo registro */}
          <Image
            src="/Imagen3.png"
            alt="Sobre Nosotros"
            width={200}
            height={200}
            className="rounded-lg shadow-lg mx-auto mt-8"
          />          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-gray-800 py-4">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            &copy; 2024 Plato Justo App. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default UserPage;
