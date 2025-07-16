module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
  cron: {
    enabled: true,
    tasks: {
      // Runs every Monday at 00:00
      '0 0 * * 1': async ({ strapi }) => {
        // Reset vendors
        await strapi.db.query('api::vendor.vendor').updateMany({
          data: { weeklyItemsSold: 0 },
        });
        // Reset dishes
        await strapi.db.query('api::dish.dish').updateMany({
          data: { weeklySalesCount: 0 },
        });
        strapi.log.info('All vendors\' weeklyItemsSold and all dishes\' weeklySalesCount reset to 0 (Monday job)');
      },
    },
  },
});
