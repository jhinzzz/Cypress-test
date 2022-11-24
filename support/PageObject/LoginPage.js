
class LoginPage{
    constructor() {
        cy.fixture('Account').then((data) => {
            this.account = data.Account;
            this.password = data.Password;
        })
    }
    getEmail(){
        return cy.get('input[name="email"]');
    }
    inputEmail(){
        return this.getEmail().type(this.account);
    }
    getPassword(){
        return cy.get('input[name="password"]');
    }
    inputPassword(){
        return this.getPassword().type(this.password);
    }
    getLogin() {
        return cy.get('span').contains('Log in');
    }
    clickLogin() {
        return this.getLogin().click();
    }
    switchLogin() {
        return cy.get('a').contains('Login in').click();
    }
    switchHomePage() {
        return cy.get('[data-selenium="header-cart"]').should('be.visible');
    }
    isSuccess() {
        return cy.getCookie('access_token').should('exist');
    }
}

export default LoginPage