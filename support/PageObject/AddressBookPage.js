
class AddressBookPage {
    
    getDeleteAddress() {
        return cy.get('svg[aria-label="bin"]');
    }
    getConfirm() {
        return cy.get('div').contains('Confirm');
    }
}

export default AddressBookPage