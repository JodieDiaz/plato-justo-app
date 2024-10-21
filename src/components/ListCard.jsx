function ProductListCard({ product }) {
  return (
    <div className="border rounded-md shadow-md p-4 bg-white mb-4">
      <h3 className="text-lg font-bold mb-2">{product.name}</h3>
      <p className="text-gray-700 mb-2">{product.description}</p>

      {/* Mostrar la imagen del producto */}
      {product.image && (
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-32 object-cover mb-4"
        />
      )}

      {/* Mostrar gramos totales */}
      <div className="text-gray-700 mb-2">
        <strong>Gramos Totales:</strong> {product.fullGrams}
      </div>

      {/* Mostrar gramos por porción completa */}
      <div className="text-gray-700 mb-2">
        <strong>Gramos por Porción Completa:</strong> {product.fullPortionGrams}
      </div>

      {/* Mostrar gramos por media porción */}
      <div className="text-gray-700 mb-2">
        <strong>Gramos por Media Porción:</strong> {product.halfPortionGrams}
      </div>

      {/* Mostrar precio por porción completa */}
      <div className="text-gray-700 mb-2">
        <strong>Precio por Porción Completa:</strong> $
        {product.fullPortionPrice}
      </div>

      {/* Mostrar precio por media porción */}
      <div className="text-gray-700 mb-2">
        <strong>Precio por Media Porción:</strong> ${product.halfPortionPrice}
      </div>

      {/* Mostrar porciones completas disponibles */}
      <div className="text-gray-700 mb-2">
        <strong>Porciones Completas Disponibles:</strong>{" "}
        {product.totalPortions}
      </div>

      {/* Mostrar gramos restantes */}
      <div className="text-gray-700 mb-2">
        <strong>Gramos Restantes:</strong> {product.remainingGrams}
      </div>

      {/* Mostrar precio total */}
      <div className="text-gray-700 mb-2">
        <strong>Precio Total (sólo porciones completas):</strong> $
        {product.fullPrice}
      </div>

      {/* Mostrar fecha y hora de creación */}
      <div className="text-gray-700 mb-2">
        <strong>Fecha y Hora de Creación:</strong>{" "}
        {new Date(product.createdAt).toLocaleString()}
      </div>

      {/* Botones de editar y borrar */}
      <div className="mt-4 flex space-x-2">
        <button
          onClick={() => onEdit(product.id)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-md"
        >
          Borrar
        </button>
      </div>
    </div>
  );
}

export default ProductListCard;
