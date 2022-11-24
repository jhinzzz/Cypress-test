import LoginPage from "../PageObject/LoginPage";

class LoginOperation {
    constructor() {
        this.LOGIN = new LoginPage();
    }
    login(){
        this.LOGIN.inputEmail();
        this.LOGIN.inputPassword();
        this.LOGIN.clickLogin();
        this.LOGIN.switchHomePage();
        this.LOGIN.isSuccess();
    }
}

export default LoginOperation