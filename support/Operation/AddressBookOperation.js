import AddressBookPage from "../PageObject/AddressBookPage";
import ProductDetailOperation from "./ProductDetailOperation";

class AddressBookOperation extends ProductDetailOperation{
    constructor(nation, pageType) {
        super(nation, pageType);
        this.book = new AddressBookPage();
    }
    deleteAddress() {
        cy.allure().step('Delete address');
        
        this.book.getDeleteAddress().click().then(() => {
            this.book.getConfirm().click();
        });
    }
}

export default AddressBookOperation;