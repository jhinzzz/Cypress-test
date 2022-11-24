import CheckoutPage from "./CheckoutPage";

class AddressPage extends CheckoutPage{
    constructor(nation) {
        // 声明父类
        super();
        this.nation = nation;
    }
    // 地址搜索框
    getSearchDropdown() {
        return cy.get('input.form-control');
    }
    inputSearchDropdown(inform='louis vuitton') {
        return this.getSearchDropdown().type(inform).click();
    }

    // 地址搜索框的第一个子选项
    getFirstAddress() {
        return cy.get('div#react-autowhatever-1').children().first();
    }
    selectFirstChild() {
        return this.getSearchDropdown().type('{downArrow}{enter}');
    }

    // 手机号
    getPhone() {
        return cy.get('input[name="phone"]');
    }
    inputPhone(phone) {
        return this.getPhone().click().type(phone);
    }
    // SG的Floor
    getFloor() {
        return cy.get('input[name="level"]');
    }
    inputFloor(floor='123') {
        return this.getFloor().click().type(floor);
    }

    // SG的Unit
    getUnit() {
        return cy.get('input[name="flat"]');
    }
    inputUnit(unit='123') {
        return this.getUnit().click().type(unit);
    }

    // AU的Building Type
    clickBuildingType() {
        return cy.get('input[name="building_type"]').click();
    }
    selectFirstBuilding() {
        return cy.get('a').contains('Apartment').click();
    }
    
    // 保存按钮
    getSaveButton() {
        return cy.get('span').contains('Save');
    }
    clickSaveButton() {
        return this.getSaveButton().click();
    }

    // 断言url
    isAddressPage() {
        return cy.url().should('contain', 'shipping-address');
    }

    // 下一步
    getContinue() {
        return cy.get('button[data-selenium="checkout-shipping-address"]').should('not.be.disabled');
    }

    clickContinue() {
        return this.getContinue().click();
    }
}

export default AddressPage