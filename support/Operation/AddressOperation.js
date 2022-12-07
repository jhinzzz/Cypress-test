import AddressPage from "../PageObject/AddressPage";
import GATracing from "../Common/GATracing";

class AddressOperation{
    constructor(nation) {
        this.nation = nation;
        this.address = new AddressPage();
        this.GA = new GATracing(nation, '_ADDRESS');
    }
    // 创建地址
    createAddress() {
        // cy.allure().story('Create address');

        cy.allure().step('Assert url')
        this.address.isAddressPage();

        // 输入字符并选中一个联想的地址
        cy.allure().step('Input search detail');
        this.address.inputSearchDropdown().then(() => {
            cy.wait(1500)
            cy.allure().step('Select first child');
            this.address.selectFirstChild();
        });
        cy.allure().step('Input address detail');
        //内容填写
        if (this.nation == 'AU') {
            this.address.inputPhone('61266668888');
            this.address.clickBuildingType();
            this.address.selectFirstBuilding();
            this.address.clickSaveButton();
        }
        else if (this.nation == 'SG') {
            this.address.inputPhone('6566668888');
            this.address.getFloor().type('1');
            this.address.getUnit().type('1');
            this.address.clickSaveButton();
        }
        else if (this.nation == 'US') {
            this.address.inputPhone('2126668888');
            this.address.clickSaveButton();
        }
        else {
            throw 'Please input correct nation';
        }
    }
    testCoupon() {
        // cy.allure().story('Test Coupon');

        this.address.getContinue().then(() => {
            cy.allure().step('Input coupon');
            this.address.inputCoupon();

            cy.allure().step('Delete coupon');
            this.address.deleteCoupon();
        })
    }
    assertAddress() {
        // cy.allure().story('Assertion');

        // 等到Continue按钮加载后再进行断言
        this.address.getContinue().then(() => {
            this.GA.assertCheckout('2');
            this.GA.assertAddCoupon();
            // this.GA.assertSearchAddress();
            // this.GA.assertAddAddress();
        });
    }
    // 下一步
    nextStep() {
        cy.allure().step('Click continue');

        this.address.clickContinue();
        cy.get('[data-selenium="checkout-shipping-method"]').should('not.be.disabled');
    }
}
export default AddressOperation