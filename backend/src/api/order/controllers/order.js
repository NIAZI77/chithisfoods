'use strict';

/**
 * order controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
  async create(ctx) {
    // Generate a unique searchableOrderId
    const searchableOrderId = Date.now() + Math.floor(Math.random() * 1000);
    
    // Add the searchableOrderId to the request body
    ctx.request.body.data.searchableOrderId = searchableOrderId;
    
    // Call the default create method
    const response = await super.create(ctx);
    return response;
  },

  async find(ctx) {
    const { search } = ctx.query;
    
    if (search) {
      // Add search filters
      ctx.query.filters = {
        ...ctx.query.filters,
        $or: [
          {
            searchableOrderId: {
              $eq: parseInt(search) || 0
            }
          },
          {
            customerName: {
              $containsi: search
            }
          },
          {
            vendorName: {
              $containsi: search
            }
          },
          {
            phone: {
              $containsi: search
            }
          },
          {
            address: {
              $containsi: search
            }
          }
        ]
      };
    }
    
    // Call the default find method
    const response = await super.find(ctx);
    return response;
  }
}));
