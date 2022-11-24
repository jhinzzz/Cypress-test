import ShippingMethodPage from "../PageObject/ShippingMethodPage"
import GATracing from "../Common/GATracing";

class ShippingMethodOperation{
    constructor(nation) {
        this.nation = nation;
        this.method = new ShippingMethodPage(nation);
        this.GA = new GATracing(nation, '_METHOD');
    }
    isShippingMethod() {
        this.method.getContinue();
    }
    testCoupon() {
        this.method.inputCoupon();
        this.method.deleteCoupon();
    }
    // 断言
    assertMethod(){
        return this.method.getContinue().then(() => {
            cy.url().should('contain', 'shipping-method');
            this.GA.assertCheckout('3');
            this.GA.assertAddCoupon();
            this.GA.assertShippingMethod();
            this.GA.assertSplitShipment();
        })
    }
    // 下一步
    nextStep() {
        this.method.clickContinue();
        return cy.get('[data-selenium="payment-complete"]').should('not.be.disabled');
    }
}

export default ShippingMethodOperation