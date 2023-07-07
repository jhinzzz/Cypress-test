import LoginPage from "../PageObject/LoginPage";

class LoginOperation {
    constructor() {
        this.LOGIN = new LoginPage();
    }
    login(){

        cy.allure().step('Input account detail');
        this.LOGIN.inputEmail();
        this.LOGIN.inputPassword();
        this.LOGIN.clickLogin();
        this.LOGIN.switchHomePage();
        this.LOGIN.isSuccess();
    }
}

export default LoginOperation