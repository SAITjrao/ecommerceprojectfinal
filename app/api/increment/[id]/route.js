import { sequelize } from '@/lib/database';

export async function POST(request, { params }) {
  try {
    await sequelize.authenticate();
    
    const product = await Product.findByPk(params.id);
    if (!product) {
      return Response.json({ error: 'Product not found' }, { status: 404 });
    }

    await product.increment('quantity');
    return Response.json({ 
      success: true,
      newQuantity: product.quantity 
    });

  } catch (error) {
    console.error('Increment error:', error);
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}