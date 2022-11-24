const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'vs4d6v',
  env: {
    SG_TEST: 'https://www-test.castlery.com/sg',
    AU_TEST: 'https://www-test.castlery.com/au',
    US_TEST: 'https://www-test.castlery.com/us',

    _LOGIN: '/login',
    
    _CATEGORY: '/sofas/all-sofas',

    _BLOG: '/blog',
    
    _TRADE: '/trade',

    _ADDRESS: '/checkout/shipping-address',

    _METHOD: '/checkout/shipping-method',

    _PAYMENT: '/checkout/payment',

    _ADDRESSBOOK: '/account/address',

    SG_API: 'https://api.castlery.sg',
    AU_API: 'https://api.castlery.com.au',
    US_API: 'https://api.castlery.co',

    SG_HPG: 'https://www.castlery.com/sg',
    AU_HPG: 'https://www.castlery.com/au',
    US_HPG: 'https://www.castlery.com/us',

    SG_MAP: 'https://api.castlery.sg/sitemap/products',
    AU_MAP: 'https://api.castlery.com.au/sitemap/products',
    US_MAP: 'https://api.castlery.co/sitemap/products',

    SG_PDP: 'https://www.castlery.com/sg/products',
    AU_PDP: 'https://www.castlery.com/au/products',
    US_PDP: 'https://www.castlery.com/us/products',

    SG_SIM: '/products/harper-side-table',
    AU_SIM: '/products/harper-side-table',
    US_SIM: '/products/harper-side-table',

    SG_CON: '/products/cammy-armchair',
    AU_CON: '/products/cammy-armchair',
    US_CON: '/products/cammy-armchair',
    
    SG_BUN: '/products/miles-dining-table-with-4-chairs',
    AU_BUN: '/products/miles-dining-table-with-4-chairs',
    US_BUN: '/products/miles-dining-table-with-4-chairs',

    SG_LLT: '/products/lucas-performance-boucle-sofa',
    AU_LLT: '/products/alexander-tv-unit-200cm',
    US_LLT: '/products/vincent-dining-table-with-2-chairs-walnut-and-doris-bench',

    NATION: ['AU', 'SG', 'US'],
  },
  pageLoadTimeout: 60000,
  defaultCommandTimeout: 15000,
  chromeWebSecurity: false,
  fixturesFolder: './fixtures',

  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    // 开启cy.session()
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    specPattern: './e2e/**/*.spec.js',
    // supportFile: false,
  },
})
