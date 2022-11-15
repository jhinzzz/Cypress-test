const { defineConfig } = require('cypress')

module.exports = defineConfig({
  projectId: 'vs4d6v',
  env: {
    SG_API: 'https://api.castlery.sg',
    SG_HPG: 'https://www.castlery.com/sg',
    SG_MAP: 'https://api.castlery.sg/sitemap/products',
    SG_PDP: 'https://www.castlery.com/sg/products',
    SG_SIM: '/products/seb-console-table',
    SG_CON: '/products/cammy-armchair',
    SG_BUN: '/products/miles-dining-table-with-4-chairs',
    SG_LLT: '/products/lucas-performance-boucle-sofa',
    AU_API: 'https://api.castlery.com.au',
    AU_HPG: 'https://www.castlery.com/au',
    AU_MAP: 'https://api.castlery.com.au/sitemap/products',
    AU_PDP: 'https://www.castlery.com/au/products',
    AU_SIM: '/products/seb-console-table',
    AU_CON: '/products/cammy-armchair',
    AU_BUN: '/products/miles-dining-table-with-4-chairs',
    AU_LLT: '/products/alexander-tv-unit-200cm',
    US_API: 'https://api.castlery.co',
    US_HPG: 'https://www.castlery.com/us',
    US_MAP: 'https://api.castlery.co/sitemap/products',
    US_PDP: 'https://www.castlery.com/us/products',
    US_SIM: '/products/seb-console-table',
    US_CON: '/products/cammy-armchair',
    US_BUN: '/products/miles-dining-table-with-4-chairs',
    US_LLT: '/products/vincent-dining-table-with-2-chairs-walnut-and-doris-bench',
  },
  pageLoadTimeout: 60000,
  defaultCommandTimeout: 15000,
  chromeWebSecurity: false,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./plugins/index.js')(on, config)
    },
    specPattern: './e2e/**/*.spec.js',
    supportFile: false,
  },
})
