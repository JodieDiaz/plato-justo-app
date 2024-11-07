'use client';

import { useRouter } from 'next/navigation';
import OrderDetails from '@/components/OrderDetails';

export default function OrderPage({ params }) {
  const router = useRouter();
  const { id } = params;

  if (!id) {
    return <div>Cargando...</div>;
  }

  return <OrderDetails orderId={id} />;
}