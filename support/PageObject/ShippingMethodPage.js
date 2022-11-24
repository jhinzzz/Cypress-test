import CheckoutPage from "./CheckoutPage";

class ShippingMethodPage extends CheckoutPage {
    constructor(nation) {
        // 声明父类
        super();
        this.nation = nation;
    }
    
    getContinue() {
        return cy.get('[data-selenium="checkout-shipping-method"]').should('not.be.disabled');
    }
    clickContinue() {
        return this.getContinue().click();
    }
}

export default ShippingMethodPage;