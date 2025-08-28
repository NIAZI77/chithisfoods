'use strict';

module.exports = {
  async up(knex) {
    // Add searchableOrderId column to orders table
    await knex.schema.alterTable('orders', (table) => {
      table.bigInteger('searchableOrderId').unique();
    });

    // Update existing orders with searchableOrderId
    const orders = await knex('orders').select('id', 'customerOrderId', 'createdAt');
    
    for (const order of orders) {
      // Generate a unique searchableOrderId based on timestamp and random number
      const timestamp = new Date(order.createdAt).getTime();
      const random = Math.floor(Math.random() * 1000);
      const searchableOrderId = timestamp + random;
      
      await knex('orders')
        .where('id', order.id)
        .update({ searchableOrderId });
    }

    // Make searchableOrderId required after populating
    await knex.schema.alterTable('orders', (table) => {
      table.bigInteger('searchableOrderId').notNullable().alter();
    });
  },

  async down(knex) {
    await knex.schema.alterTable('orders', (table) => {
      table.dropColumn('searchableOrderId');
    });
  }
};
