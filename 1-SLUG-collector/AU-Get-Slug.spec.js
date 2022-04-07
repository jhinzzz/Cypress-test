/// <reference types="cypress" />

describe('get AU slugs', () => {
    it('write json',() => {
        cy.request(Cypress.env('AU_MAP')).then((response)=>{ //获取products的slug
            cy.writeFile('cypress/fixtures/AU-slugs.json', response.body)
        })
        cy.fixture('AU-slugs').then((slug) => {
            expect(slug[0]).to.be.exist
        })
    })
})