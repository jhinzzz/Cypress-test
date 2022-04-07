/// <reference types="cypress" />

describe('get US slugs', () => {
    it('write json',() => {
        cy.request(Cypress.env('US_MAP')).then((response)=>{ //获取products的slug
            cy.writeFile('cypress/fixtures/US-slugs.json', response.body)
        })
        cy.fixture('US-slugs').then((slug) => {
            expect(slug[0]).to.be.exist
        })
    })
})
