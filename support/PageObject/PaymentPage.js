import CheckoutPage from "./CheckoutPage";

class PaymentPage extends CheckoutPage {
    constructor(nation) {
        // 声明父类
        super();
        this.nation = nation;
        cy.fixture("Stripe").then((stripe) => {
            this.iframeName = stripe.STRIPE_IFRAME_PREFIX;
            this.cardNumber = stripe.normalCard.cardNumber;
            this.cardExpiry = stripe.normalCard.cardExpiry;
            this.cardCvc = stripe.normalCard.cardCvc;
        })
        this.getStripeIFrameDocument = () => {
            return cy.checkElementExists(`iframe[name^="${this.iframeName}"]`).iframeCustom()
          }
    }
    inputCreditCard() {
        this.getStripeIFrameDocument().find('input[data-elements-stable-field-name="cardNumber"]').type(this.cardNumber)
        this.getStripeIFrameDocument().find('input[data-elements-stable-field-name="cardExpiry"]').type(this.cardExpiry)
        this.getStripeIFrameDocument().find('input[data-elements-stable-field-name="cardCvc"]').type(this.cardCvc)
    }
    
    getTerms() {
        return cy.get('[data-selenium="payment-terms"]').should('not.be.disabled');
    }

    clickTerms() {
        return this.getTerms().click();
    }

    // 完成订单
    getContinue() {
        return cy.get('[data-selenium="payment-complete"]').should('not.be.disabled');
    }
    clickContinue() {
        return this.getContinue().click();
    }

    // 判断是否到达SuccessPage
    isSuccessPage() {
        return cy.get('span').contains('Continue Shopping').should('be.visible');
    }
}

export default PaymentPage;