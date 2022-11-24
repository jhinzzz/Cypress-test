
class CheckoutPage{
    // Coupon
    getCoupon() {
        return cy.get('[data-selenium="add_coupon_code"]').should('not.be.disabled');
    }
    inputCoupon(code='CYPRESSTEST') {
        return this.getCoupon().click().then(() => {
            cy.get('input[name="coupon_code"]').should('not.be.disabled').type(code+'{enter}');
        });
    }
    deleteCoupon(code='CYPRESSTEST') {
        return cy.get('[data-selenium="order-coupon"]').should('not.be.disabled').prev().find('.btn').click();
    }
}

export default CheckoutPage;