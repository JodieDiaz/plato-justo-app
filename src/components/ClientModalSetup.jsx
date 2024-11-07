"use client"; // Indica que esto debe ejecutarse en el cliente

import { useEffect } from "react";
import Modal from "react-modal";

const ClientModalSetup = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Solo ejecutamos esto en el cliente
      const appElement = document.getElementById("__next");

      if (appElement) {
        Modal.setAppElement(appElement); // Debe estar en el contenedor principal de Next.js
      } else {
        console.error("El contenedor #__next no está disponible.");
      }
    }
  }, []);

  return null; // No renderiza nada
};

export default ClientModalSetup;
