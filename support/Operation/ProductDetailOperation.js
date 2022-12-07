import ProductDetailPage from "../PageObject/ProductDetailPage";
import GATracing from "../Common/GATracing";

class ProductDetailOperation{
    constructor(nation, pageType) {
        this.nation = nation;
        this.pageType = pageType;
        this.product = new ProductDetailPage();
        this.GA = new GATracing(this.nation, this.pageType);
    }

    checkoutFlow(pageType) {
        // cy.allure().step('Test ATC');
        // cy.allure().story('Test add to cart');
        
        cy.allure().step('Click add to cart button')
        this.product.getATC().click().then(() => {
            cy.allure().step('Click checkout button');
            this.product.getCheckout().click();

            cy.allure().step('Assert');
            this.GA.assertCheckout('1');
        });
    }

    RemoveCart() {
        
        // cy.allure().story('Test remove');
        cy.allure().step('Click cart button')
        this.product.getCart().click().then(() => {
            cy.allure().step('Remove product');
            this.product.getRemove().click();
        })
    }
}

export default ProductDetailOperation;