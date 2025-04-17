import { DataTypes } from 'sequelize';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';
import Product from '@/models/Product';

export async function GET(request, { params }) {
  try {
    const order = await Order.findOne({
      where: { order_id: params.order_id },
      include: [{
        model: OrderItem,                                                                                                                                                                                                                         
        include: [Product]
      }]
    });

    if (!order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(order), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}