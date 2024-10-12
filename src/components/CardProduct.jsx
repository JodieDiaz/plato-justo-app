import Image from "next/image";

export default function CardProduct() {
  return (
    <div className="bg-gray-200 p-4 rounded-lg left-12 text-center hover:bg-primary transition-all">
      <div className="relative w-[100px] h-[100px] mx-auto">
        <Image
          src="/Imagen3.png"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
          style={{ objectFit: "contain" }}
          alt="Porcion"
        />
      </div>
      <h4 className="font-semibold my-4">Arroz favorito</h4>
      <p> Descripciòn del prodùcto</p>
      <button className="bg-primary text-white rounded-full px-4 py-2">
        Comprar $5000
      </button>
    </div>
  );
}
