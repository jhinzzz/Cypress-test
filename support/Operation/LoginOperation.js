import LoginPage from "../PageObject/LoginPage";

class LoginOperation {
    constructor() {
        this.LOGIN = new LoginPage();
    }
    login(){
        cy.allure().step('Login');
        
        this.LOGIN.inputEmail();
        this.LOGIN.inputPassword();
        this.LOGIN.clickLogin();
        this.LOGIN.switchHomePage();
        this.LOGIN.isSuccess();
    }
}

export default LoginOperation