import "./globals.css";
import connectToDatabase from "@/libs/db";
import { CartProvider } from "@/context/CartContext";
import ClientModalSetup from "@/components/ClientModalSetup"; // Importa el componente de configuración del modal

export const metadata = {
  title: "Plato Justo",
  description: "App para gestionar pedidos en restaurantes",
};

connectToDatabase();

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="antialiased">
        {/* Configuramos el modal solo en el cliente */}
        <ClientModalSetup />

        {/* CartProvider debe envolver a todos los componentes hijos */}
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
