import PaymentPage from "../PageObject/PaymentPage";
import GATracing from "../Common/GATracing";

class PaymentOperation {
    constructor(nation) {
        this.nation = nation;
        this.payment = new PaymentPage(this.nation);
        this.GA = new GATracing(this.nation, '_PAYMENT');

    }
    
    isPaymentPage() {
        this.payment.getContinue();
    }

    chooseCard() {
        return this.payment.getContinue().then(() => {
            cy.url().should('contain', 'payment');
            this.payment.inputCreditCard();
            this.payment.clickTerms();
        })
    }

    testCoupon() {
        this.payment.inputCoupon();
        this.payment.deleteCoupon();
    }

    assertPayment() {
        this.GA.assertCheckout('4');
        this.GA.assertAddCoupon();
        // this.GA.assertTransaction();
    }
    
    nextStep() {
        this.payment.clickContinue();
        // this.payment.isSuccessPage();
    }
}

export default PaymentOperation;