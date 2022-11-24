// PDP相关的对象获取

class CategoryPage{
    getFirstProduct() {
        return cy.get('[data-selenium="category-product"]:first').should('not.be.disabled');
    }
    getDropdownFilter() {
        return cy.get('[data-selenium="sort_filter"]').should('not.be.disabled');
    }
    getHighestPrice() {
        return cy.get('a').contains('Price: High to Low');
    }
}

export default CategoryPage