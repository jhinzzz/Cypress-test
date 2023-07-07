import PaymentPage from "../PageObject/PaymentPage";
import GATracing from "../Common/GATracing";

class PaymentOperation {
    constructor(nation) {
        this.nation = nation;
        this.payment = new PaymentPage(this.nation);
        this.GA = new GATracing(this.nation, '_PAYMENT');

    }
    
    isPaymentPage() {
        cy.allure().step('Assert url');
        this.payment.getContinue();
    }

    chooseCard() {
        // cy.allure().story('Choose card pay');

        return this.payment.getContinue().then(() => {
            cy.url().should('contain', 'payment');

            cy.allure().step('Input card');
            this.payment.inputCreditCard();

            cy.allure().step('Select terms');
            this.payment.clickTerms();
        })
    }

    testCoupon() {
        // cy.allure().story('Test Coupon');

        cy.allure().step('Input coupon');
        this.payment.inputCoupon();

        cy.allure().step('Delete coupon');
        this.payment.deleteCoupon();
    }

    assertPayment() {
        // cy.allure().story('Assertion');

        this.GA.assertCheckout('4');
        this.GA.assertAddCoupon();
        // this.GA.assertTransaction();
    }
    
    nextStep() {
        cy.allure().step('Click continue');

        this.payment.clickContinue();
        // this.payment.isSuccessPage();
    }
}

export default PaymentOperation;