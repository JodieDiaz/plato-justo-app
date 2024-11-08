// pages/api/crear-pedido.js
import { crearPedido } from '../../lib/pedidoService';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const pedidoId = await crearPedido(req.body);
      res.status(201).json({ success: true, pedidoId: pedidoId });
    } catch (error) {
      console.error('Error al crear el pedido:', error);
      res.status(500).json({ success: false, error: 'Error al crear el pedido' });
    }
  } else {
    res.status(405).json({ success: false, error: 'Método no permitido' });
  }
}