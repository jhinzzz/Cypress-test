/// <reference types="cypress" />

describe('prod checkout', ()=>{
    before('login', ()=>{
        cy.visit('https://www.castlery.com/us/login')
        cy.get("input[autocomplete='email']").click().type('evan.fang@test.com')
        cy.get("input[autocomplete='current-password']").click().type('123456')
        cy.get("button[data-selenium='log_in']").click()
    })
    it('checkout', ()=>{
        cy.visit('https://www.castlery.com/us/products/adams-chaise-sectional-sofa')
        cy.get("a[data-selenium='add_to_cart']").click()
        cy.get("span").contains('Checkout').click()
        cy.get("span").contains('Add Coupon Code').click().type('z6huaj').type("enter")
        cy.get('')
        cy.get("button[data-selenium='checkout-shipping-address']")
        cy.get("button[data-selenium='checkout-shipping-method']")
        cy.contains('We’ve Received Your Order!').should('be.visible')
    })
})