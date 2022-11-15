
import ProductDetailPage from '../../support/PageObject/ProductDetailPage'
describe('test demo', () => {
    before('', ()=>{
        cy.request("GET", Cypress.env("AU_API") + "/v3" + Cypress.env("AU_CON")).as('comments')
    })
    it('testing', () => {
        let pdp = new ProductDetailPage()
        cy.visit('https://www.castlery.com/au/products/cammy-armchair?material=canary_yellow')
        pdp.addSwatch()
        let yyy =  pdp.getSwatchText()
    })
    it('testing 2', ()=>{
        cy.window().then((win) => {
            win.dataLayer.some((dl) => {
                cy.request("GET", Cypress.env("AU_API") + "/v3" + Cypress.env("AU_CON")).as('comments').then((response)=>{
                    if (dl.event === "productDetail") {
                        dl.ecommerce.detail.products.some((sku) => {
                          if (
                            sku.id === response.body.variants[0].sku &&
                            sku.name === response.body.variants[0].name
                            // product_dimension.includes(sku.dimension1)
                          ) {
                            console.log("success")
                          }
                          else{
                            console.log(sku.brand,product_brand, sku.id, product_sku, sku.name, product_name, sku.category, product_category)
                          };
                        });
                      }
                })
            });
        });
    });
});