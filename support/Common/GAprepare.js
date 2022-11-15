import { data } from "cypress/types/jquery"

class Layer {
    
    constructor(dl) {
        this.dl = dl
        cy.fixture('GA_data').as(data)
    };
    request(){
        cy.request("GET", Cypress.env("AU_API") + "/v3" + Cypress.env("AU_CON")).as('comments')
    };

    isPageView(){
        let res = this.request()
        if(this.dl.event === "productDetail"){
            cy.get()
            this.dl.ecommerce.detail.products.some((sku) => {
                cy.get('@comments').then((response)=>{
                    if (
                        sku.id === response.body.variants[0].sku
                        // product_dimension.includes(sku.dimension1)
                      ) {
                        return true
                      }
                    else{
                        console.log(sku.id, response.body.variants[0].sku)
                    }
                })
                
            })
        }
        else{
            console.log(this.dl.event)
            return false
        }
    }
}

export default Layer