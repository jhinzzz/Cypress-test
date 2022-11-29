// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import 'cypress-wait-until';
import 'cypress-iframe';
// import Cookie from '../../support/Common/setCookie';

Cypress.Commands.add('iframeCustom', { prevSubject: 'element' }, ($iframe) => {
  return new Cypress.Promise((resolve) => {
    $iframe.ready(function () {
      resolve($iframe.contents().find('body'))
    })
  })
})
  
Cypress.Commands.add('checkElementExists', (selector) => {
  return cy.get(selector).should('exist').then(cy.wrap)
})

Cypress.Commands.add('hideCountryHint', () => {
  //cy.allure().step('Set up country hint');
  cy.setCookie('select_country_hint_hidden', 'true');
  cy.getCookie('select_country_hint_hidden').should('have.property','value', 'true');
})