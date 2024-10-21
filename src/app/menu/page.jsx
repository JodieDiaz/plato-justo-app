// src/app/menu/page.jsx
import HomeMenu from "../../components/HomeMenu"; // Ajusta la ruta según tu estructura

export default function MenuPage() {
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-5xl font-bold text-center my-8">Menú</h1>
      <HomeMenu />
    </div>
  );
}
