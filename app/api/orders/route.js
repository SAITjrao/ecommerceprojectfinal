import sequelize from '@/lib/sequelize';
import Order from '@/models/Order';
import OrderItem from '@/models/OrderItem';

export async function POST(request) {
  const transaction = await sequelize.transaction();

  try {
    const { user_id, items, total_amount } = await request.json();

    // Create the order
    const order = await Order.create({
      user_id,
      total_amount,
      status: 'Pending',
      payment_status: 0
    }, { transaction });

    // Create order items
    await Promise.all(
      items.map(item => 
        OrderItem.create({
          order_id: order.order_id,
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        }, { transaction })
      )
    );

    await transaction.commit();

    return Response.json({
      success: true,
      order_id: order.order_id
    });

  } catch (error) {
    await transaction.rollback();
    console.error('Order creation error:', error);
    return Response.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}