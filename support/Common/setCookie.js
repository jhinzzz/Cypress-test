
class Cookie{
    
    hideCountry(){
        return cy.setCookie('select_country_hint_hidden', 'true');
    }
    isHideCountry(){
        return cy.getCookie('select_country_hint_hidden').should('have.property','value', 'true');
    }   
}

export default Cookie