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
        cy.allure().step('Create address');

        this.address.isAddressPage();
        // 输入字符并选中一个联想的地址
        this.address.inputSearchDropdown().then(() => {
            cy.wait(1500)
            this.address.selectFirstChild();
        });
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
        cy.allure().step('Test Coupon');

        this.address.getContinue().then(() => {
            this.address.inputCoupon();
            this.address.deleteCoupon();
        })
    }
    assertAddress() {
        cy.allure().step('Assertion');

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