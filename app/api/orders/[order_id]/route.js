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
      return Response.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return Response.json(order);

  } catch (error) {
    console.error('Order fetch error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}