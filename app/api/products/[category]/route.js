import sequelize from '@/lib/sequelize';
import Product from '../../../../models/Product';

export async function GET(request, { params }) {

  try {
    await sequelize.authenticate();
    const products = await Product.findAll({
      where: { category: params.category },
      raw: true
    });

    return Response.json({ 
      success: true,
      data: products 
    });
    
  } catch (error) {
    console.error('Database error:', error);
    return Response.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}