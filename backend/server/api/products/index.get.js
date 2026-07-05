import { productsData } from '~/server/data/products';

export default defineEventHandler(async event => {
  try {
    const query = getQuery(event);
    const category = query.category as string;
    const id = query.id as string;

    // যদি id দেওয়া থাকে
    if (id) {
      const product = productsData.find(p => p.id === id);

      if (!product) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Product not found',
        });
      }

      return {
        success: true,
        data: product,
      };
    }

    // Category filter
    let filteredProducts = productsData;

    if (category) {
      filteredProducts = productsData.filter(p => p.category === category);
    }

    return {
      success: true,
      data: filteredProducts,
      count: filteredProducts.length,
    };
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to fetch products',
    });
  }
});
