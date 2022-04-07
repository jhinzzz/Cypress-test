/// <reference types="cypress" />

describe('get SG slugs', () => {
    it('write json',() => {
        cy.request(Cypress.env('SG_MAP')).then((response)=>{ //获取products的slug
            cy.writeFile('cypress/fixtures/SG-slugs.json', response.body)
        })
        cy.fixture('SG-slugs').then((slug) => {
            expect(slug[0]).to.be.exist
        })
    })
})